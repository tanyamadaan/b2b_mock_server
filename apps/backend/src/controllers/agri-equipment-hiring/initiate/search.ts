import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	send_response,
	AGRI_EQUIPMENT_BAP_MOCKSERVER_URL,
	AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
} from "../../../lib/utils";
import { ACTTION_KEY } from "../../../lib/utils/actionOnActionKeys";


export const initiateSearchController = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { bpp_uri, city, domain } = req.body;
		const file = fs.readFileSync(
			path.join(AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, `${ACTTION_KEY.SEARCH}/${ACTTION_KEY.SEARCH}.yaml`)
		);
		let search = YAML.parse(file.toString());
		search = search.value;
		const transaction_id = uuidv4();
		const timestamp = new Date().toISOString();
	
		search = {
			...search,
			context: {
				...search.context,
				timestamp,
				location: {
					...search.context.location,
					city: {
						code: city
					}
				},
				transaction_id,
				domain,
				bap_id: MOCKSERVER_ID,
				bap_uri: AGRI_EQUIPMENT_BAP_MOCKSERVER_URL,
				message_id: uuidv4()
			},
		};
		search.bpp_uri = bpp_uri
		await send_response(res, next, search, transaction_id, ACTTION_KEY.SEARCH);
	}catch(error){
		return next(error);
	}
};
