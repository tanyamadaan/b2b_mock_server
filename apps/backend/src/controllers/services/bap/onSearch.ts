import { Request, Response } from "express";
import { SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSearchController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "consultation-reschedule":
			onSearchConsultationRescheduleController(req, res);
			break;
		case "consultation":
			onSearchConsultationController(req, res);
			break;
		case "service":
			onSearchServiceController(req, res);
			break;
		case "without-schedule":
			onSearchWithoutScheduleController(req, res);
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

const onSearchConsultationRescheduleController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "select/select_consultation_reschedule.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/select`,
		`select`,
		"services"
	);
};

const onSearchConsultationController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "select/select_consultation.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/select`,
		`select`,
		"services"
	);
};

const onSearchServiceController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "select/select_service.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/select`,
		`select`,
		"services"
	);
};

const onSearchWithoutScheduleController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "select/select_without_schedule.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/select`,
		`select`,
		"services"
	);
};

