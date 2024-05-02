import { Request, Response } from "express";
import {
	MOCKSERVER_ID,
	SERVICES_BAP_MOCKSERVER_URL,
	checkIfCustomized,
	createAuthHeader,
	logger,
	redis,
	redisFetch
} from "../../../lib/utils";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateSelectController = async (req: Request, res: Response) => {
	const { scenario, transactionId } = req.body;

	// const transactionKeys = await redis.keys(`${transactionId}-*`);
	// const ifTransactionExist = transactionKeys.filter((e) =>
	// 	e.includes("on_search-to-server")
	// );

	// if (ifTransactionExist.length === 0) {
	// 	return res.status(400).json({
	// 		message: {
	// 			ack: {
	// 				status: "NACK",
	// 			},
	// 		},
	// 		error: {
	// 			message: "On search doesn't exist",
	// 		},
	// 	});
	// }
	// const transaction = await redis.mget(ifTransactionExist);
	// const parsedTransaction = transaction.map((ele) => {
	// 	return JSON.parse(ele as string);
	// });
	const on_select = await redisFetch("on_select", transactionId)
	if(!on_select){
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

	return intializeRequest(req, res, on_select, scenario);
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
			catalog: { fulfillments, payments, providers },
		},
	} = transaction;
	const { transaction_id } = context;
	const { id, locations } = providers[0];
	const { id: item_id, parent_item_id, location_ids } = providers[0].items[0];
	let items = [];
	if (scenario === "customization") {
		//parent_item_id not in customization
		items = [
			{
				id: item_id,
				parent_item_id,
				location_ids,
				quantity: {
					selected: {
						count: 3,
					},
				},
			},
			...providers[0].items.slice(1).map((item: any) => {
				return {
					// ...item,
					id: item.id,
					parent_item_id,
					quantity: {
						selected: {
							count: 3,
						},
					},
					category_ids: item.category_ids,
					location_ids: [location_ids],
					tags: item.tags.map((tag: any) => ({
						...tag,
						list: tag.list.map((itm2: any, index: any) => {
							if (index === 0) {
								return {
									descriptor: {
										code: "type",
									},
									value: "customization",
								};
							} else {
								return itm2; // Return the item unchanged if it's not the first element
							}
						}),
					})),
				};
			}),
		];
	} else {
		items = providers[0].items = [
			providers[0]?.items.map(
				({
					id,
					parent_item_id,
					location_ids,
				}: {
					id: any;
					parent_item_id: any;
					location_ids: any;
				}) => ({ id, parent_item_id, location_ids: [{ id: location_ids[0] }] })
			)[0],
		];
	}
	// console.log("Items::", JSON.stringify(items), "Senario::", scenario)
	const select = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "select",
			bap_id: MOCKSERVER_ID,
			bap_uri: SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4(),
		},
		message: {
			order: {
				provider: {
					id,
					locations: [
						{
							id: locations[0]?.id,
						},
					],
				},
				items: items.map((itm: any) => ({
					...itm,
					location_ids: itm.location_ids
						? itm.location_ids.map((id: any) => String(id))
						: undefined,
					quantity: {
						selected: {
							count: 1,
						},
					},
				})),
				fulfillments: [
					{
						...fulfillments[0],
						type: fulfillments[0].type,
						stops: [
							{
								type: "end",
								location: {
									gps: "12.974002,77.613458",
									area_code: "560001",
								},
								time: {
									label: "selected",
									range: {
										// should be dynamic on the basis of scehdule
										start: providers[0].time.schedule.times[0],
										end: providers[0].time.schedule.times[1],
									},
								},
								days: scenario === "customization" ? "4" : undefined,
								// 	? fulfillments[0].stops[0].time.days.split(",")[0]
								// 	: undefined,
							},
						],
					},
				],
				payments: [{ type: payments[0].type }],
			},
		},
	};

	const header = await createAuthHeader(select);
	try {
		await redis.set(
			`${transaction_id}-select-from-server`,
			JSON.stringify({ request: { ...select } })
		);
		const response = await axios.post(`${context.bpp_uri}/select`, select, {
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
		logger.error({ type: "response", message: (error as any).response?.data });
		// console.log("ERROR:::::", (error as any).response?.data);
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
