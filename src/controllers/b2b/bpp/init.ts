import { Request, Response } from "express";
import { onInitDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const initController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitDomestic.message,
		req.body.context.bap_uri,
    `on_${ACTIONS.init}`
	);
};
