import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	redis,
	AGRI_SERVICES_BAP_MOCKSERVER_URL,
	AGRI_SERVICES_BPP_MOCKSERVER_URL,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";

export const initiateStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { transactionId } = req.body;
	const on_confirm = await redisFetchToServer("on_confirm", transactionId);
	
	if (!on_confirm) {
		send_nack(res,"On Confirm doesn't exist")
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
	context.bpp_uri = AGRI_SERVICES_BPP_MOCKSERVER_URL
	
	const status = {
		context: {
			...context,
			message_id: uuidv4(),
			timestamp: new Date().toISOString(),
			action: "status",
			bap_id: MOCKSERVER_ID,
			bap_uri: AGRI_SERVICES_BAP_MOCKSERVER_URL,
		},
		message: {
			order_id: transaction.message.order.id,
		},
	};
	await send_response(res, next, status, transaction_id, "status");
};
