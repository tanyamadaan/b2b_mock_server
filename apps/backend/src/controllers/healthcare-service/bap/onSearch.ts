import { NextFunction, Request, Response } from "express";
import { SERVICES_EXAMPLES_PATH, checkIfCustomized, responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response, next: NextFunction) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "selection":
			onSearchSelectionController(req, res, next);
			break;
		default:
			onSearchSelectionController(req, res, next);
			break;
	}
};

const onSearchSelectionController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message } = req.body;
	const { fulfillments, payments, providers } = message.catalog
	const { id, locations, ...remainingProviders } = providers[0]
	const resposneMessage = message

	return responseBuilder(
		res,
		next,
		context,
		resposneMessage,
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
		`select`,
		"healthcare-service"
	);
};





