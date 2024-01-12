import { Request, Response } from "express";
import { onUpdateFulfillments, onUpdatePrepaid } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const updateFulfillmentController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onUpdateFulfillments.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.update}`
	);
};

export const updatePrepaidController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onUpdatePrepaid.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.update}`
	);
};