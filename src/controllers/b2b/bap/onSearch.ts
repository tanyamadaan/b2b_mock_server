import { Request, Response } from "express";
import { selectDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		selectDomestic.message,
		req.body.context.bap_uri,
		ACTIONS.select
	);
};
