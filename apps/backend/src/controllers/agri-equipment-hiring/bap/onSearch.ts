import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { scenario } = req.query;
		switch (scenario) {
			case "selection":
				onSearchSelectionController(req, res, next);
				break;
			default:
				onSearchSelectionController(req, res, next);
				break;
		}
	}catch(error){
		return next(error)
	}

};

const onSearchSelectionController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { context, message } = req.body;
		const resposneMessage = message
		return responseBuilder(
			res,
			next,
			context,
			resposneMessage,
			`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
			`select`,
			"agri-equipment-hiring"
		);
	}catch(error){
		next(error)
	}
};





