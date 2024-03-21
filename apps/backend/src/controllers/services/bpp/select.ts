import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import {
	SERVICES_EXAMPLES_PATH,
	responseBuilder,
	quoteCreatorService,
} from "../../../lib/utils";
import path from "path";
import fs from "fs";
import YAML from "yaml";

export const selectController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		// schedule_confirmed, schedule_rejected 
		case "schedule_confirmed":
			selectConsultationConfirmController(req, res);
			break;
		case "schedule_rejected ":
			selectConsultationRejectController(req, res);
			break;
		// case "service-confirmed":
		// 	selectServiceConfirmController(req, res);
		// 	break;
		// case "service-rejected":
		// 	selectServiceRejectController(req, res);
		// 	break;
		// case "nack":
		// 	selectNackController(req, res);
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
			selectConsultationConfirmController(req, res);
			break;
	}
};

const selectConsultationConfirmController = (
	req: Request,
	res: Response
) => {
	const { context,message } = req.body;
	const { locations, ...provider } = message.order.provider;

	var responseMessage = {
    order: {
      provider,
      payments: message.order.payments.map(({ type }: { type: string }) => ({
        type,
        collected_by: "BAP",
      })),
      items: message.order.items.map(({ location_ids, ...remaining }:
        { location_ids: any; remaining: any; }) => ({ ...remaining, fulfilment_ids: [uuidv4()] })
      ),
      fulfillments: message.order.fulfillments.map(({ id, stops, ...each }: any) => ({
        id,
        tracking: false,
        state: {
          descriptor: {
            code: "Serviceable"
          }
        },
        stops
      })),
      quote: quoteCreatorService(message.order.items),
    },
  };

	// const file = fs.readFileSync(
	// 	path.join(
	// 		SERVICES_EXAMPLES_PATH,
	// 		"on_select/on_select_consultation_confirmed.yaml"
	// 	)
	// );
	// const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"services"
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
		`on_select`,
		"services"
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
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"services"
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
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"services"
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
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"services"
	);
};
