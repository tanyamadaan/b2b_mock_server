import { Request, Response } from "express";
import { ACTIONS, responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const updateController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'fulfillment':
			updateFulfillmentController(req, res)
			break;
		case 'prepaid':
			updatePrepaidController(req, res)
			break;
		case 'prepaid-bap':
			updatePrepaidBAPController(req, res)
			break;
		default:
			res.status(404).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					message: "Invalid scenario",
				},
			});
			break;
	}
}



export const updateFulfillmentController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_update/on_update_fulfillments.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.update}`
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
		`${req.body.context.bap_uri}/on_${ACTIONS.update}`,
		`on_${ACTIONS.update}`
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
		`${req.body.context.bap_uri}/on_${ACTIONS.update}`,
		`on_${ACTIONS.update}`
	);
};
