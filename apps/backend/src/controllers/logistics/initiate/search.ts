import { NextFunction, Request, Response } from "express";
import {
	LOGISTICS_BAP_MOCKSERVER_URL,
	LOGISTICS_EXAMPLES_PATH,
	MOCKSERVER_ID,
	send_response,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateSearchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bpp_uri, city, domain } = req.body;
		var search;
		switch (domain) {
			case "ONDC:LOG10":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/search/search_by_air_delivery.yaml"
					)
				);
				search = YAML.parse(file.toString());
				break;
			case "ONDC:LOG11":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/search/search_by_air_delivery.yaml"
					)
				);
				search = YAML.parse(file.toString());
				break;
			default:
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/search/search_by_air_delivery.yaml"
					)
				);
				search = YAML.parse(file.toString());
				break;
		}
		const transaction_id = uuidv4();
		var newTime = new Date().toISOString();
		search = search.value;
    search = {
			...search,
      context: {
        ...search.context,
        timestamp: newTime,
        location: {
          ...search.context.location,
          city: {
            code: city,
          },
        },
        transaction_id,
        message_id: uuidv4(),
        // bpp_id: MOCKSERVER_ID,
        bpp_uri,
        domain,
        bap_id: MOCKSERVER_ID,
        bap_uri: LOGISTICS_BAP_MOCKSERVER_URL,
      },
    };
		await send_response(res, next, search, transaction_id, "search");
	} catch (error) {
		return next(error);
	}
};
