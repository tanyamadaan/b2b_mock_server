import { Request, Response } from "express";

import {
	SERVICES_EXAMPLES_PATH,
	responseBuilder,
} from "../../../lib/utils";
import path from "path";
import fs from "fs";
import YAML from "yaml";

export const selectController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "consultation-confirmed":
			selectConsultationConfirmController(req, res);
			break;
		case "consultation-rejected":
			selectConsultationRejectController(req, res);
			break;
		case "service-confirmed":
			selectServiceConfirmController(req, res);
			break;
		case "service-rejected":
			selectServiceRejectController(req, res);
			break;
		case "nack":
			selectNackController(req, res);
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

const selectConsultationConfirmController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(
			SERVICES_EXAMPLES_PATH,
			"on_select/on_select_consultation_confirmed.yaml"
		)
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_select`,
		`on_select`
	);
};

const selectConsultationRejectController = (
	req: Request,
	res: Response
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(
			SERVICES_EXAMPLES_PATH,
			"on_select/on_select_consultation_rejected.yaml"
		)
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_select`,
		`on_select`
	);
};

const selectServiceConfirmController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(
			SERVICES_EXAMPLES_PATH,
			"on_select/on_select_service_confirmed.yaml"
		)
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_select`,
		`on_select`
	);
};

const selectServiceRejectController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(
			SERVICES_EXAMPLES_PATH,
			"on_select/on_select_service_rejected.yaml"
		)
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_select`,
		`on_select`
	);
};

const selectNackController = (req: Request, res: Response) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(
			SERVICES_EXAMPLES_PATH,
			"on_select/on_select_nack.yaml"
		)
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		response.value.message,
		`${context.bap_uri}/on_select`,
		`on_select`
	);
};
