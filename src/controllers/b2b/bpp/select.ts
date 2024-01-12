import { Request, Response } from "express";
import { onSelectDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const selectController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectDomestic.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};
