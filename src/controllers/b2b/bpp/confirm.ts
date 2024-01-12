import { Request, Response } from "express";
import { onConfirmDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const confirmController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onConfirmDomestic.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.confirm}`
	);
};
