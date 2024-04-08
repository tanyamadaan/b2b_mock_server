import { Request, Response } from "express";
import {
	B2B_BAP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	createAuthHeader,
	logger,
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

	// console.log("parsedTransaction:::: ", parsedTransaction[0]);
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
			order: { provider, provider_location, ...order },
		},
	} = transaction;
	const { transaction_id } = context.transaction_id;
	const timestamp = new Date().toISOString();

	const confirm = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "confirm",
			bap_id: MOCKSERVER_ID,
			bap_uri: B2B_BAP_MOCKSERVER_URL,
		},
		message: {
			order: {
				...order,
				id: uuidv4(),
				state: "Created",
				provider: {
					id: provider.id,
					locations: [
						{
							...provider_location,
						},
					],
				},
				fulfillments: order.fulfillments.map(
					({ id, type, tracking, stops }: any) => ({
						id,
						type,
						tracking,
						stops,
					})
				),
				payments: [
					{
						...order.payments[0],
						params: {
							currency: order.quote.price.currency,
							amount: order.quote.price.value,
						},
						status: "NOT-PAID",
						"@ondc/org/settlement_details": [
							{
								settlement_counterparty: "buyer-app",
								settlement_phase: "sale-amount",
								settlement_type: "upi",
								upi_address: "gft@oksbi",
								settlement_bank_account_no: "XXXXXXXXXX",
								settlement_ifsc_code: "XXXXXXXXX",
								beneficiary_name: "xxxxx",
								bank_name: "xxxx",
								branch_name: "xxxx",
							},
						],
					},
				],
				created_at: timestamp,
				updated_at: timestamp,
			},
		},
	};

	const header = await createAuthHeader(confirm);
	try {
		await redis.set(
			`${transaction_id}-confirm-from-server`,
			JSON.stringify({ request: { ...confirm } })
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
		// logger.error({ type: "response", message: error });
		// console.log("ERROR :::::::::::::", (error as any).response.data.error);

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
