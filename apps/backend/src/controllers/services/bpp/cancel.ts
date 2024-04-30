// import { Request, Response } from "express";
// import { SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
// import fs from "fs";
// import path from "path";
// import YAML from "yaml";


// export const cancelController = (req: Request, res: Response) => {
// 	const { scenario } = req.query;
// 	switch (scenario) {
// 		case "ack":
// 			cancelAckController(req, res);
// 			break;
// 		case "merchant":
// 			cancelMerchantController(req, res);
// 			break;
// 		default:
// 			res.status(404).json({
// 				message: {
// 					ack: {
// 						status: "NACK",
// 					},
// 				},
// 				error: {
// 					message: "Invalid scenario",
// 				},
// 			});
// 			break;
// 	}
// };


// export const cancelAckController = (req: Request, res: Response) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_cancel/on_cancel_ack.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		context,
// 		response.value.message,
// 		`${context.bap_uri}/on_confirm`,
// 		`on_confirm`,
// 		"services"
// 	);
// };


// export const cancelMerchantController = (req: Request, res: Response) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_cancel/on_cancel_merchant.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		context,
// 		response.value.message,
// 		`${context.bap_uri}/on_confirm`,
// 		`on_confirm`,
// 		"services"
// 	);
// };
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
	const parsedTransaction = transaction.map((ele: any) => {
		return JSON.parse(ele as string);
	});

	if (parsedTransaction[0].request.message.order.id != req.body.message.order_id) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "Order id does not exist",
			},
		});
	}

	// console.log("Items with there ids :", item_payment_ids[0])
	cancelRequest(req, res, parsedTransaction[0].request, scenario);
}

const cancelRequest = async (req: Request, res: Response, transaction: any, scenario: any) => {

	const { context } = req.body;

	const responseMessage = {
		order: {
			// ...transaction.message.order,
			state: "Cancelled",
			cancellation: {
				cancelled_by: "CONSUMER",
				reason: {
					id: req.body.message.cancellation_reason_id
				}
			},
			rateable: {
				...transaction.message.order.rateable,
				rateable: undefined
			},
			items: transaction.message.order.items,
			quote: transaction.message.order.quote,
			fulfillments: transaction.message.order.fulfillments.map((fulfillment: any) => ({
				...fulfillment,
				state: {

					...fulfillment.state,
					descriptor: {
						code: "Cancelled"
					}
				},
				rateable: undefined
			})),
			billing: transaction.message.order.billing,
			payments: transaction.message.order.payments.map((itm: any) => ({
				...itm,
				tags: itm.tags.filter((tag: any) => tag.descriptor.code !== "Settlement_Counterparty")
			}))
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


