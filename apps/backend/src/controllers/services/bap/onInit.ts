import { Request, Response } from "express";
import { ACTIONS, SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onInitController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'consultation':
			onInitConsultationController(req, res)
			break;
		case 'service':
			onInitServiceController(req, res)
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

const onInitConsultationController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "confirm/confirm_consultation.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/${ACTIONS.confirm}`,
		`${ACTIONS.confirm}`
	);
};

const onInitServiceController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "confirm/confirm_service.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/${ACTIONS.confirm}`,
		`${ACTIONS.confirm}`
	);
};

