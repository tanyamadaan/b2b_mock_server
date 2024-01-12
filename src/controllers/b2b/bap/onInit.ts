import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { confirmDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onInitController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		confirmDomestic.message,
		req.body.context.bap_uri,
		ACTIONS.confirm
	);
};
