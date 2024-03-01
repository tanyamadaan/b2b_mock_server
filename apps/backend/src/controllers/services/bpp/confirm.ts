import { Request, Response } from "express";
import { ACTIONS, SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";


export const confirmController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "consultation":
			confirmConsultationController(req, res);
			break;
		case "service":
			confirmServiceController(req, res);
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


export const confirmConsultationController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_confirm/on_confirm_consultation.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_${ACTIONS.confirm}`,
		`on_${ACTIONS.confirm}`
	);
};


export const confirmServiceController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_confirm/on_confirm_service.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_${ACTIONS.confirm}`,
		`on_${ACTIONS.confirm}`
	);
};

