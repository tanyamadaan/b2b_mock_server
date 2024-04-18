import { Request, Response } from "express";
import {
	MOCKSERVER_ID,
	SERVICES_BAP_MOCKSERVER_URL,
	checkIfCustomized,
	createAuthHeader,
	logger,
	redis,
} from "../../../lib/utils";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateInitController = async (req: Request, res: Response) => {
	const { scenario, transactionId } = req.body;

	const transactionKeys = await redis.keys(`${transactionId}-*`);
	const ifTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_select-to-server")
	);

	if (ifTransactionExist.length === 0) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "On Select doesn't exist",
			},
		});
	}
	const transaction = await redis.mget(ifTransactionExist);
	const parsedTransaction = transaction.map((ele) => {
		return JSON.parse(ele as string);
	});

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
			order: { provider, fulfillments, quote },
		},
	} = transaction;
	let { payments, items } = transaction.message.order;
	const { id, type, stops } = fulfillments[0];
	const { id: parent_item_id, location_ids, ...item } = items[0];
	const { transaction_id } = context;

	const customized = checkIfCustomized(items);

	//get item_id with quantity
	const id_quantity = quote.breakup.reduce((accumulator: any, itm: any) => {
		if (itm.tags[0].list[0].value === "item") {
			accumulator[itm.item.id] = itm.item.quantity
		}
		return accumulator
	}, {});
	console.log("Item Arr::", id_quantity)
	if (customized) {
		items = [
			items[0],
			...items
				.slice(1)
				.map(({ location_ids, ...item }: { location_ids: any }) => {
					return {
						...item,
						quantity: {
							measure: {
								unit: "unit",
								value: "1",
							},
						},
					};
				}),
		];
	} else {
		items = items.map(
			({ location_ids, ...items }: { location_ids: any }) => items
		);
	}
	const init = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "init",
			bap_id: MOCKSERVER_ID,
			bap_uri: SERVICES_BAP_MOCKSERVER_URL,
		},
		message: {
			order: {
				provider: {
					...provider,
					locations: [{ id: uuidv4() }],
				},
				items: items.map((itm: any) => ({
					...itm,
					quantity: {
						...id_quantity[itm.id],
						measure: {
							unit: "seats",
							value: "2"
						}
					}
				})),
				billing: {
					name: "ONDC buyer",
					address:
						"22, Mahatma Gandhi Rd, Craig Park Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
					state: {
						name: "Karnataka",
					},
					city: {
						name: "Bengaluru",
					},
					tax_id: "XXXXXXXXXXXXXXX",
					email: "nobody@nomail.com",
					phone: "9886098860",
				},
				fulfillments: [
					{
						id,
						type,
						stops: [
							{
								...stops[0],
								id: customized ? stops[0].id : undefined,
								location: {
									gps: "12.974002,77.613458",
									address: "My House #, My buildin",
									city: {
										name: "Bengaluru",
									},
									country: {
										code: "IND",
									},
									area_code: "560001",
									state: {
										name: "Karnataka",
									},
								},
								contact: {
									phone: "9886098860",
								},
								time: stops[0].time,
							},
						],
					},
				],
				payments,
			},
		},
	};
	console.log("ITEMS::", init.message.order.items)
	const header = await createAuthHeader(init);
	try {
		console.log("Before sending request ..")
		await redis.set(
			`${transaction_id}-init-from-server`,
			JSON.stringify({ request: { ...init } })
		);
		await axios.post(`${context.bpp_uri}/init?scenario=${scenario}`, init, {
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
		console.log("ERROR:::::", (error as any).response?.data.error);
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
