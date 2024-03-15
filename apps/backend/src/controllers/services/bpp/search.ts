import { Request, Response } from "express";
import {
	SERVICES_EXAMPLES_PATH,
	responseBuilder,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const searchController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_search/on_search.yaml")
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_search`,
		`on_search`
	);
};
