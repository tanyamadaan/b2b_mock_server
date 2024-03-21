import { Request, Response } from "express";
import { SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSearchController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "selection":
			onSearchSelectionController(req, res);
			break;
		// case "consultation":
		// 	onSearchConsultationController(req, res);
		// 	break;
		// case "service":
		// 	onSearchServiceController(req, res);
		// 	break;
		// case "without-schedule":
		// 	onSearchWithoutScheduleController(req, res);
		// 	break;
		default:
			// res.status(404).json({
			// 	message: {
			// 		ack: {
			// 			status: "NACK",
			// 		},
			// 	},
			// 	error: {
			// 		message: "Invalid scenario",
			// 	},
			// });
			onSearchSelectionController(req, res);
			break;
	}
};

const onSearchSelectionController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { fulfillments, payments, providers } = message.catalog
	const { id, locations, ...remainingProviders } = providers[0]

	// const file = fs.readFileSync(
	// 	path.join(SERVICES_EXAMPLES_PATH, "select/select_consultation_reschedule.yaml")
	// );
	// const response = YAML.parse(file.toString());
	const resposneMessage = {
		order: {
			provider: {
				id,
				locations: [{
					id: locations[0]?.id
				}],
			},
			items: [providers[0]?.items.map(({ id, parent_item_id, location_ids }:
				{ id: any, parent_item_id: any, location_ids: any }) => ({ id, parent_item_id, location_ids: [{ id: location_ids[0] }] }))[0]],
			fulfillments: [
				{
					type: fulfillments[0].type,
					stops: [
						{
							"type": "end",
							"location":
							{
								"gps": "12.974002,77.613458",
								"area_code": "560001"
							},
							"time": {
								"label": "selected",
								"range": { // should be dynamic on the basis of scehdule
									"start": providers[0].time.schedule.times[0],
									"end": providers[0].time.schedule.times.pop()
								}
							}
						}
					]
				}
			],
			payments: [{ type: payments[0].type }]
		}
	}

	return responseBuilder(
		res,
		context,
		resposneMessage,
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
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
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
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
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
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
		`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
		`select`,
		"services"
	);
};

