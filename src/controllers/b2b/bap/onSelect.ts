import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { initDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSelectController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		initDomestic.message,
		req.body.context.bap_uri,
		ACTIONS.init
	);
};
