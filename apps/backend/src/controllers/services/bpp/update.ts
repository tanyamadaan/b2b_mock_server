import { Request, Response } from "express";
import { SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const updateController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "requote":
			updateRequoteController(req, res);
			break;
		case "reschedule":
			updateRescheduleController(req, res);
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
};

export const updateRequoteController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_update/on_update_requote.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_update`,
		`on_update`,
		"services"
	);
};

export const updateRescheduleController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_update/on_update_reschedule.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_update`,
		`on_update`,
		"services"
	);
};
