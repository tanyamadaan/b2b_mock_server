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
	// getting on_search data for payment_ids
	const search = await redis.mget(`${transaction_id}-on_search-from-server`);
	const parsedSearch = search.map((ele: any) => {
		return JSON.parse(ele as string);
	})
	// console.log("Search ::", parsedSearch[0].request.message.catalog.providers[0].items)
	const provider_id = parsedTransaction[0].request.message.order.provider.id

	const item_measure_ids = parsedSearch[0].request.message.catalog.providers[0].items.reduce((accumulator: any, currentItem: any) => {
		accumulator[currentItem.id] = currentItem.quantity ? currentItem.quantity.unitized.measure : undefined;
		return accumulator;
	}, {});
	// console.log("Items with there ids :", item_measure_ids)
	req.body.item_measure_ids = item_measure_ids
	cancelRequest(req, res, parsedTransaction[0].request, scenario);
}

const cancelRequest = async (req: Request, res: Response, transaction: any, scenario: any) => {

	const { context } = req.body;

	const responseMessage = {
		order: {
			id: req.body.message.order_id,
			status: "Cancelled",
			cancellation: {
				cancelled_by: "CONSUMER",
				reason: {
					descriptor: {
						code: req.body.message.cancellation_reason_id
					}
				}
			},
			provider: {
				...transaction.message.order.provider,
				rateable: undefined
			},
			items: transaction.message.order.items.map((itm: any) => ({
				...itm,
				quantity: {
					...itm.quantity,
					measure: req.body.item_measure_ids[itm.id] ? req.body.item_measure_ids[itm.id] : { unit: "", value: "" }
				}
			})),
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
			})),
			updated_at: new Date().toISOString()

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


