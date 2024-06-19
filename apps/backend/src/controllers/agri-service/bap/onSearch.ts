import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response, next: NextFunction) => {
	onSearchSelectionController(req, res, next);
};

const onSearchSelectionController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message} = req.body;
	const resposneMessage = {}
	return responseBuilder(
		res,
		next,
		context,
		resposneMessage,
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
		`select`,
		"agri-services"
	);
};






