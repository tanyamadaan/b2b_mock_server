import { NextFunction, Request, Response } from "express";
import {
	send_response,
	send_nack,
	redisFetchToServer,
	AGRI_SERVICES_BPP_MOCKSERVER_URL,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";

export const initiateCancelController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { transactionId, orderId, cancellationReasonId } = req.body;
	const on_confirm = await redisFetchToServer("on_confirm", transactionId);

	if (!on_confirm) {
		return send_nack(res,"On Confirm doesn't exist")
	}

	on_confirm.context.bpp_uri = AGRI_SERVICES_BPP_MOCKSERVER_URL
	return intializeRequest(res, next, on_confirm, orderId, cancellationReasonId);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	order_id: string,
	cancellation_reason_id: string
) => {
	try{
		const { context } = transaction;
		let scenario="ack"
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
		await send_response(res, next, cancel, context.transaction_id, "cancel",scenario=scenario);
	}catch(error){
		return next(error)
	}
	
};
