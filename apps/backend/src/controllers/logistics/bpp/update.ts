import { NextFunction, Request, Response } from "express";
import {
	send_nack,
	redis,
	responseBuilder,
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

function getRandomFile(directory: string): string | null {
	const files = fs.readdirSync(directory);
	const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

	if (yamlFiles.length === 0) {
		console.error(`No YAML files found in directory: ${directory}`);
		return null;
	}

	const randomIndex = Math.floor(Math.random() * yamlFiles.length);

	return path.join(directory, yamlFiles[randomIndex]);
}

export const updateController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { scenario } = req.query;
	const sandboxMode = res.getHeader("mode") === "sandbox";
	if (!sandboxMode) {
		try {
			const domain = req.body.context.domain;
			let directory: string;

			// Determine the directory based on the domain
			switch (domain) {
				case "ONDC:LOG10":
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_update"
					);
					break;

				case "ONDC:LOG11":
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/on_update"
					);
					break;

				default:
					// Fallback to the LOG10 directory if the domain is not recognized
					directory = path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_update"
					);
					break;
			}

			let file;
			switch (scenario) {
				case "regular":
					file = path.join(directory, "on_update_air.yaml");
					break;
				default:
					file = path.join(directory, "on_update_air_diff.yaml");
			}
			if (!file) {
				return null; // Return null or handle this case as needed
			}

			const fileContent = fs.readFileSync(file, "utf8");
			const response = YAML.parse(fileContent);

			return responseBuilder_logistics(
				res,
				next,
				response.value.context,
				response.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
				}`,
				`on_update`,
				"logistics"
			);
		} catch (error) {
			return next(error);
		}
	} else {
		try {
			const { transaction_id } = req.body.context;
			const transactionKeys = await redis.keys(`${transaction_id}-*`);

			const update = req.body;
			const message = update.message;
			const { update_target, order } = message;
			const { id, status, provider, items, fulfillments, updated_at } = order;
			// checking on_confirm response exits or not
			const ifTransactionExist = transactionKeys.filter((e) =>
				e.includes("on_confirm-from-server")
			);

			if (ifTransactionExist.length === 0) {
				return send_nack(res, "On Confirm doesn't exist");
			}

			const transactionString = await redis.mget(ifTransactionExist);
			let transactions = transactionString.map((str) => {
				if (str) {
					try {
						return JSON.parse(str);
					} catch (error) {
						console.error("Error parsing JSON string:", str, error);
						return null;
					}
				}
			});

			let ts = new Date();
			ts.setSeconds(ts.getSeconds() + 1);

			let response = {
				order: {
					id: id,
					status: "In-progress",
					provider: provider,
					items: items,
					fulfillments: fulfillments,
					quote: transactions[0].request.message.quote,
					updated_at: ts.toISOString(),
				},
			};
			return responseBuilder(
				res,
				next,
				req.body.context,
				response,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
				}`,
				`on_update`,
				"logistics"
			);
		} catch (error) {
			return next(error);
		}
	}
};
