import { Request, Response } from "express";
import {
	SERVICES_EXAMPLES_PATH,
	quoteCreatorService,
	responseBuilder,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initController = (req: Request, res: Response) => {
	initConsultationController(req, res);
	// const { scenario } = req.query;
	// switch (scenario) {
	// 	case "consultation":
	// 		initConsultationController(req, res);
	// 		break;
	// 	case "service":
	// 		initServiceController(req, res);
	// 		break;
	// 	default:
	// 		res.status(404).json({
	// 			message: {
	// 				ack: {
	// 					status: "NACK",
	// 				},
	// 			},
	// 			error: {
	// 				message: "Invalid scenario",
	// 			},
	// 		});
	// 		break;
	// }
};
const initConsultationController = (req: Request, res: Response) => {
	const { context, message: { order: { provider, items, billing, fulfillments, payments } } } = req.body;

	const { locations, ...remainingProvider } = provider
	const { stops, ...remainingfulfillments } = fulfillments[0]

	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_consultation.yaml")
	);
	const response = YAML.parse(file.toString());
	const responseMessage = {
		order: {
			provider: remainingProvider,
			locations,
			items: [items[0]],
			billing,
			fulfillments: [{
				...remainingfulfillments,
				"tracking": false,
				stops: stops.map((stop: any) => {
					return {
						...stop,
						tags: {
							"descriptor": {
								"code": "schedule"
							},
							"list": [
								{
									"descriptor": {
										"code": "ttl"
									},
									"value": "PT1H"
								}
							]
						}
					}
				})
			}],
			quote: quoteCreatorService(items),
			payments: [{
				id: payments[0].id,
				type: payments[0].type,
				...response.value.message.order.payments[0]
			}],
			xinput: response.value.message.order.xinput
		}
	}
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/on_init`,
		`on_init`,
		"services"
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
		`${context.bap_uri}/on_init`,
		`on_init`,
		"services"
	);
};
