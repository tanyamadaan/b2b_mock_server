import { Request, Response } from "express";

import { SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const statusController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'completed':
			statusCompletedController(req, res)
			break;
		case 'in-transit':
			statusInTransitController(req, res)
			break;
		case 'reached-re-otp':
			statusReachedReOtpController(req, res)
			break;
		case 'reached':
			statusReachedController(req, res)
			break;
		case 'service-started':
			statusServiceStartedController(req, res)
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

const statusCompletedController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Completed.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_status`,
		`on_status`,
		"services"
	);
};

const statusInTransitController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_In_Transit.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_status`,
		`on_status`,
		"services"
	);
};

const statusReachedReOtpController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached_re-otp.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_status`,
		`on_status`,
		"services"
	);
};
const statusReachedController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_status`,
		`on_status`,
		"services"
	);
};

const statusServiceStartedController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Service_Started.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_status`,
		`on_status`,
		"services"
	);
};

