import { Request, Response } from "express";
import {
	SERVICES_BAP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	checkIfCustomized,
	createAuthHeader,
	logger,
	quoteCreatorService,
	quoteCreatorServiceCustomized,
	redis,
} from "../../../lib/utils";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateConfirmController = async (
	req: Request,
	res: Response
) => {
	const { scenario, transactionId } = req.body;

	const transactionKeys = await redis.keys(`${transactionId}-*`);
	const ifTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_init-to-server")
	);

	if (ifTransactionExist.length === 0) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "On Init doesn't exist",
			},
		});
	}
	const transaction = await redis.mget(ifTransactionExist);
	const parsedTransaction = transaction.map((ele) => {
		return JSON.parse(ele as string);
	});

	console.log("parsedTransaction:::: ", parsedTransaction[0]);
	return intializeRequest(req, res, parsedTransaction[0].request, scenario);
};

const intializeRequest = async (
	req: Request,
	res: Response,
	transaction: any,
	scenario: string
) => {
	const {
		context,
		message: {
			order: {
				provider,
				locations,
				payments,
				fulfillments,
				xinput,
				items
			},
		},
	} = transaction;
	const { transaction_id } = context;
	const { stops, ...remainingfulfillments } = fulfillments[0];

	const timestamp = new Date().toISOString();

	const customized = checkIfCustomized(items);

	const confirm = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "confirm",
			bap_id: MOCKSERVER_ID,
			bap_uri: SERVICES_BAP_MOCKSERVER_URL,
		},
		message: {
			order: {
				id: uuidv4(),
				state: "Created",
				provider: {
					...provider,
					...locations,
				},
				items,
				fulfillments: [
					{
						...remainingfulfillments,
						stops: stops.map(({ tags, ...stop }: { tags: any }) => {
							return {
								...stop,
								customer: {
									person: {
										name: "Ramu",
									},
								},
							};
						}),
					},
				],
				quote: customized
					? quoteCreatorServiceCustomized(items)
					: quoteCreatorService(items),
				payments: [
					{
						...payments[0],
						status: "PAID",
					},
				],
				created_at: timestamp,
				updated_at: timestamp,
				xinput,
			},
		},
	};

	const header = await createAuthHeader(confirm);
	try {
		await redis.set(
			`${transaction_id}-confirm-from-server`,
			JSON.stringify({ request: confirm })
		);
		await axios.post(`${context.bpp_uri}/confirm`, confirm, {
			headers: {
				"X-Gateway-Authorization": header,
				authorization: header,
			},
		});

		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
			transaction_id,
		});
	} catch (error) {
		logger.error({ type: "response", message: error });
		return res.json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				// message: (error as any).message,
				message: "Error Occurred while pinging NP at BPP URI",
			},
		});
	}
};
