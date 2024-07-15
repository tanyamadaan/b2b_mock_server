import { NextFunction, Request, Response } from "express";

import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	LOGISTICS_EXAMPLES_PATH,
	responseBuilder_logistics,
} from "../../../lib/utils";

export const searchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";
		try {
			const domain = req.body.context.domain;

			var onSearch;
			switch (domain) {
				case "ONDC:LOG10":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_search/on_search.yaml"
						)
					);
					onSearch = YAML.parse(file.toString());
					break;
				case "ONDC:LOG11":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Int_Logistics_yaml/on_search/on_search.yaml"
						)
					);
					onSearch = YAML.parse(file.toString());
					break;
				default:
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_search/on_search.yaml"
						)
					);
					onSearch = YAML.parse(file.toString());
					break;
			}
			if(!sandboxMode){return responseBuilder_logistics(
				res,
				next,
				onSearch.value.context,
				onSearch.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
				}`,
				`on_search`,
				"logistics"
			);}
			else{
				return responseBuilder_logistics(res, next, req.body.context, onSearch.value.message, `${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"}`, `on_search`, "logistics");
			}
		} catch (error) {
			return next(error);
		}
};
