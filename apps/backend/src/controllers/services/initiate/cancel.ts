import { NextFunction, Request, Response } from "express";
import {
	send_response,
	send_nack,
	createAuthHeader,
	redis,
	logger,
	redisFetch,
} from "../../../lib/utils";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateCancelController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { transactionId, orderId, cancellationReasonId } = req.body;
	// const transactionKeys = await redis.keys(`${transactionId}-*`);

	const on_confirm = await redisFetch("on_confirm", transactionId);
	if (!on_confirm) {
		return send_nack(res, "On Confirm doesn't exist");
	}
	// console.log("parsedTransaction:::: ", parsedTransaction[0]);
	return intializeRequest(res, next, on_confirm, orderId, cancellationReasonId);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	order_id: string,
	cancellation_reason_id: string
) => {
	const { context } = transaction;
	let scenario = "ack";
	const cancel = {
		context: {
			...context,
			action: "cancel",
			message_id: uuidv4(),
		},
		message: {
			order_id,
			cancellation_reason_id,
		},
	};
	await send_response(
		res,
		next,
		cancel,
		context.transaction_id,
		"cancel",
		(scenario = scenario)
	);
	// const header = await createAuthHeader(cancel);
	// try {
	// 	await redis.set(
	// 		`${context.transaction_id}-cancel-from-server`,
	// 		JSON.stringify({ request: { ...cancel } })
	// 	);
	// 	const response = await axios.post(
	// 		`${context.bpp_uri}/cancel?scenario=ack`,
	// 		cancel,
	// 		{
	// 			headers: {
	// 				// "X-Gateway-Authorization": header,
	// 				authorization: header,
	// 			},
	// 		}
	// 	);
	// 	await redis.set(
	// 		`${context.transaction_id}-cancel-from-server`,
	// 		JSON.stringify({
	// 			request: { ...cancel },
	// 			response: {
	// 				response: response.data,
	// 				timestamp: new Date().toISOString(),
	// 			},
	// 		})
	// 	);

	// 	return res.json({
	// 		message: {
	// 			ack: {
	// 				status: "ACK",
	// 			},
	// 		},
	// 		transaction_id: context.transaction_id,
	// 	});
	// } catch (error) {
	// 	return next(error);
	// }
};
