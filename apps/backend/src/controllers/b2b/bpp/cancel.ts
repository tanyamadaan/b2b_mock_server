import { Request, Response } from "express";
import { responseBuilder, B2B_EXAMPLES_PATH, redis } from "../../../lib/utils";

export const cancelController = async (req: Request, res: Response) => {
	const { scenario } = req.query;
	const { transaction_id } = req.body.context;

	const transactionKeys = await redis.keys(`${transaction_id}-*`);
	const ifTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_confirm-from-server")
	);

	if (ifTransactionExist.length === 0) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "on confirm doesn't exist",
			},
		});
	}
	const transaction = await redis.mget(ifTransactionExist);
	const parsedTransaction = transaction.map((ele) => {
		return JSON.parse(ele as string);
	});
	cancelRequest(req, res, parsedTransaction, scenario);
}

const cancelRequest = async (req: Request, res: Response, transaction: any, scenario: any) => {
	// const { message } = transaction
	const { context } = req.body;
	console.log("Inside cancel")
	const responseMessage = {
		...transaction.message,
		order: {
			...transaction.message.order,
			state: "Cancelled",
			cancellation: {
				cancelled_by: req.body.context.bap_id,
				reason: {
					id: req.body.message.cancellation_reason_id
				}
			},
			fulfillments: transaction.message.order.fulfillments.map((fulfillment: any) => ({
				...fulfillment,
				stops: fulfillment.stops.map((stop: any) => {
					// Add the instructions to both start and end stops
					const instructions = {
						name: "Proof of pickup",
						short_desc: "Proof of pickup details",
						long_desc: "Proof of pickup details",
						images: [
							"https://image1_url.png"
						]
					};
					// Check if the stop type is "end"
					if (stop.type === "end") {
						// Add the agent object to the stop
						return {
							...stop,
							instructions: {
								...instructions,
								name: "Proof of delivery",
								short_desc: "Proof of delivery details",
								long_desc: "Proof of delivery details",
							},
							location: {
								...stop.location
							},
							agent: {
								person: {
									name: "Ramu"
								},
								contact: {
									phone: "9886098860"
								}
							}
						};
					} else if (stop.type === "start") {
						// For stops of type "start", add the instructions and location modifications
						return {
							...stop,
							instructions,
							location: {
								...stop.location,
								descriptor: {
									...stop.location.descriptor,
									images: ["https://gf-integration/images/5.png"]
								}
							}
						};
					} else {
						// For other types, return the stop as is with instructions
						return {
							...stop,
							instructions
						};
					}
				}),
				rateable: undefined
			})),

		}
	}

	return responseBuilder(
		res,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_cancel" : "/on_cancel"
		}`,
		`on_cancel`,
		"b2b",
	)
}


