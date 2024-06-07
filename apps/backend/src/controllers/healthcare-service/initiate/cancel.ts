import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	send_response,
	send_nack,
	logger,
	redisFetch,
	HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL,
} from "../../../lib/utils";


export const initiateCancelController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { transactionId, orderId, cancellationReasonId } = req.body;
	const on_confirm = await redisFetch("on_confirm", transactionId);
	if (!on_confirm) {
		send_nack(res, "On Confirm doesn't exist")
	}
	on_confirm.context.bpp_uri = HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
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
	let scenario = "ack"
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
	await send_response(res, next, cancel, context.transaction_id, "cancel", scenario = scenario);
};
