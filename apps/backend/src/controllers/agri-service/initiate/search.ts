import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	AGRI_SERVICES_EXAMPLES_PATH,
	send_response,
	AGRI_SERVICES_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";

export const initiateSearchController = async (req: Request, res: Response,  next: NextFunction) => {
	
	const { bpp_uri, city, domain } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "search/search_by_category.yaml")
	);

	let search = YAML.parse(file.toString());
	search = search?.value;
	const transaction_id = uuidv4();

	search = {
		...search,
		context: {
			...search.context,
			timestamp: new Date().toISOString(),
			location: {
				...search.context.location,
				city: {
					code: city
				}
			},
			transaction_id,
			domain,
			bap_id: MOCKSERVER_ID,
			bap_uri: AGRI_SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4()
		},
	};
	search.bpp_uri=bpp_uri

	await send_response(res, next, search,transaction_id, "search");
};
