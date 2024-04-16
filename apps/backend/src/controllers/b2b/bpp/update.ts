import { Request, Response } from "express";
import { responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const updateController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "fulfillment":
			updateFulfillmentController(req, res);
			break;
		case "prepaid":
			updatePrepaidController(req, res);
			break;
		case "prepaid-bap":
			updatePrepaidBAPController(req, res);
			break;
		default:
			updateFulfillmentController(req, res);
			break;
	}
};

export const updateFulfillmentController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_update/on_update_fulfillments.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"b2b"
	);
};

export const updatePrepaidController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_update/on_update_prepaid.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"b2b"
	);
};

export const updatePrepaidBAPController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_update/on_update_prepaid_BAP.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"b2b"
	);
};
