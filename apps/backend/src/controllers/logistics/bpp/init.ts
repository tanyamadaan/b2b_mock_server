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
	if (!sandboxMode) {
		try {
			const domain = req.body.context.domain;

			let response;
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
			response = YAML.parse(fileContent);
			return responseBuilder_logistics(
				res,
				next,
				response.value.context,
				response.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
				}`,
				`on_init`,
				"logistics",
				response.value.error ? response.value.error : undefined
			);
		} catch (error) {
			next(error);
		}
	} else {
		try {
			const { transaction_id } = req.body.context;
			console.log("Transaction ID ",transaction_id);
			const transactionKeys = await redis.keys(`${transaction_id}-*`);
			const ifTransactionExist = transactionKeys.filter((e) =>
				e.includes("on_search-from-server")
			);
			if (ifTransactionExist.length === 0) {
				return send_nack(res, "On Search doesn't exist");
			}
			const transaction = await redis.mget(ifTransactionExist);
			const parsedTransaction = transaction.map((ele) => {
				return JSON.parse(ele as string);
			});

			const request = parsedTransaction[0].request;
			if (Object.keys(request).includes("error")) {
				return send_nack(res, "On Search had errors");
			}

			initDomesticController(req, res, next);
		} catch (error) {
			return next(error);
		}
	}
};

const initDomesticController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const domain = req.body.context.domain;
		console.log("Here\n");
		console.log(req.body.context);
		var response;
		switch (domain) {
			case "ONDC:LOG10":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_init/on_init_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
			case "ONDC:LOG11":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/on_init/on_init_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
			default:
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_init/on_init_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
		}
		response.value.context.transaction_id = req.body.context.transaction_id;
		return responseBuilder_logistics(
			res,
			next,
			req.body.context,
			response.value.message,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
			}`,
			`on_init`,
			"logistics"
		);
	} catch (error) {
		next(error);
	}
};
