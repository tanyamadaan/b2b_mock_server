import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
	HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL,
} from "../../../lib/utils";


export const initiateStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { transactionId } = req.body;
	const on_confirm = await redisFetchToServer("on_confirm", transactionId);
	if (!on_confirm) {
		return send_nack(res, "On Confirm doesn't exist")
	}

	return intializeRequest(res, next, on_confirm);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any
) => {
	const { context } = transaction;
	const { transaction_id } = context;
	context.bpp_uri = HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL

	const status = {
		context: {
			...context,
			message_id: uuidv4(),
			timestamp: new Date().toISOString(),
			action: "status",
			bap_id: MOCKSERVER_ID,
			bap_uri: HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
		},
		message: {
			order_id: transaction.message.order.id,
		},
	};

	await send_response(res, next, status, transaction_id, "status");
};
