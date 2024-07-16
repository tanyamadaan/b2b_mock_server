import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
	Fulfillment,
	quoteCreator,
	redis,
	send_nack,
	Item,
	Breakup,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

interface Item_id_name {
	[key: string]: string;
}

export const initController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { scenario } = req.query;
	const sandboxMode = res.getHeader("mode") === "sandbox";
	try {
		const domain = req.body.context.domain;

		let onInit;
		let file;
		switch (domain) {
			case "ONDC:LOG10":
				file = path.join(
					LOGISTICS_EXAMPLES_PATH,
					"/B2B_Dom_Logistics_yaml/on_init/"
				);

				break;
			case "ONDC:LOG11":
				file = path.join(
					LOGISTICS_EXAMPLES_PATH,
					"/B2B_Int_Logistics_yaml/on_init/"
				);

				break;
			default:
				file = path.join(
					LOGISTICS_EXAMPLES_PATH,
					"/B2B_Dom_Logistics_yaml/on_init/"
				);

				break;
		}
		switch (scenario) {
			case "success":
				const successPath = path.join(file, "on_init_air_kyc_success.yaml");
				if (fs.existsSync(successPath)) {
					file = successPath;
					break;
				}
			// If the file does not exist, do not break; instead, continue to the default case
			default:
				file = path.join(file, "on_init_air.yaml");
		}
		if (!file) {
			return null; // Return null or handle this case as needed
		}
		const fileContent = fs.readFileSync(file, "utf8");
		onInit = YAML.parse(fileContent);
		if (!sandboxMode) {
			return responseBuilder_logistics(
				res,
				next,
				onInit.value.context,
				onInit.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
				}`,
				`on_init`,
				"logistics",
				onInit.value.error ? onInit.value.error : undefined
			);
		} else {
			return responseBuilder_logistics(
				res,
				next,
				req.body.context,
				onInit.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
				}`,
				`on_init`,
				"logistics"
			);
		}
	} catch (error) {
		next(error);
	}
};
