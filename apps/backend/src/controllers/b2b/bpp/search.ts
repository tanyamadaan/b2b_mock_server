import { Request, Response } from "express";

import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	B2B_EXAMPLES_PATH,
	B2B_BAP_MOCKSERVER_URL,
	responseBuilder,
	createResponseAuthHeader,
	logger,
} from "../../../lib/utils";
import axios from "axios";

export const searchController = async (req: Request, res: Response) => {
	const domain = req.body.context.domain;

	var onSearch;
	switch (domain) {
		case "ONDC:RET1A":
			var file = fs.readFileSync(
				path.join(
					B2B_EXAMPLES_PATH,
					"on_search/on_search_autoparts_and_components.yaml"
				)
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET13":
			var file = fs.readFileSync(
				path.join(B2B_EXAMPLES_PATH, "on_search/on_search_bpc.yaml")
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET1D":
			var file = fs.readFileSync(
				path.join(B2B_EXAMPLES_PATH, "on_search/on_search_chemicals.yaml")
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET1C":
			var file = fs.readFileSync(
				path.join(
					B2B_EXAMPLES_PATH,
					"on_search/on_search_construction_and_building.yaml"
				)
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET14":
			var file = fs.readFileSync(
				path.join(
					B2B_EXAMPLES_PATH,
					"on_search/on_search_electronics_mobile.yaml"
				)
			);
			onSearch = YAML.parse(file.toString());
			break;
		// case "ONDC:RET14":
		// 	var file = fs.readFileSync(
		// 		path.join(B2B_EXAMPLES_PATH, "on_search/on_search_electronics.yaml")
		// 	);
		// 	onSearch = YAML.parse(file.toString());
		// 	break;
		case "ONDC:RET12":
			var file = fs.readFileSync(
				path.join(B2B_EXAMPLES_PATH, "on_search/on_search_fashion.yaml")
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET10":
			var file = fs.readFileSync(
				path.join(B2B_EXAMPLES_PATH, "on_search/on_search_grocery.yaml")
			);
			onSearch = YAML.parse(file.toString());
			break;
		case "ONDC:RET1B":
			var file = fs.readFileSync(
				path.join(
					B2B_EXAMPLES_PATH,
					"on_search/on_search_hardware_and_industrial.yaml"
				)
			);
			onSearch = YAML.parse(file.toString());
			break;
		// case "ONDC:RET1D":
		// 	var file = fs.readFileSync(
		// 		path.join(B2B_EXAMPLES_PATH, "on_search/on_search_payment_BPP.yaml")
		// 	);
		// 	onSearch = YAML.parse(file.toString());
		// 	break;
		default:
			var file = fs.readFileSync(
				path.join(B2B_EXAMPLES_PATH, "on_search/on_search.yaml")
			);
			onSearch = YAML.parse(file.toString());
			break;
	}
	if (req.body.context.bap_uri === B2B_BAP_MOCKSERVER_URL) {
		const header = await createResponseAuthHeader(req.body);
		try {
			await axios.post(`${req.body.context.bpp_uri}/search`, req.body, {
				headers: {
					"X-Gateway-Authorization": header,
					authorization: header,
				},
			});
		} catch (error) {
			logger.error({ type: "response", message: error });
			return res.json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					// message: (error as any).message,
					message: "Error Occurred while pinging NP at BPP URI",
				},
			});
		}
	}

	return responseBuilder(
		res,
		req.body.context,
		onSearch.value.message,
		`${req.body.context.bap_uri}/on_search`,
		`on_search`,
		"b2b"
	);
};
