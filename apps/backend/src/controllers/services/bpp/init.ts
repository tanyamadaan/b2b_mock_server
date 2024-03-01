import { Request, Response } from "express";
import {
	ACTIONS,
	SERVICES_EXAMPLES_PATH,
	responseBuilder,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const initController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "consultation":
			initConsultationController(req, res);
			break;
		case "service":
			initServiceController(req, res);
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
const initConsultationController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_consultation.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_${ACTIONS.init}`,
		`on_${ACTIONS.init}`
	);
};

const initServiceController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_service.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_${ACTIONS.init}`,
		`on_${ACTIONS.init}`
	);
};
