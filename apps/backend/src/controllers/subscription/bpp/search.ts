import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	responseBuilder,
	SUBSCRIPTION_EXAMPLES_PATH,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { SUBSCRIPTION_DOMAINS } from "../../../lib/utils/apiConstants";

export const searchController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const domain = req.body.context.domain;
		let file;
		const {
			message: { intent },
		} = req.body;

		switch (domain) {
			case SUBSCRIPTION_DOMAINS.PRINT_MEDIA:
				file = fs.readFileSync(
					path.join(
						SUBSCRIPTION_EXAMPLES_PATH,
						`on_search/${
								"on_search_print.yaml"
						}`
					)
				);
				break;
			default:
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "on_search/on_search.yaml")
				);
				break;
		}
		const response = YAML.parse(file.toString());

		return responseBuilder(
			res,
			next,
			req.body.context,
			response.value.message,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
			}`,
			`${ON_ACTION_KEY.ON_SEARCH}`,
			"subscription"
		);
	} catch (error) {
		return next(error);
	}
};
