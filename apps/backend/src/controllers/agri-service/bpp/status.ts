import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AGRI_SERVICES_BAP_MOCKSERVER_URL, AGRI_SERVICES_EXAMPLES_PATH, MOCKSERVER_ID, checkIfCustomized, quoteCreatorAgriService, quoteCreatorServiceCustomized, redisFetchFromServer, responseBuilder, send_nack } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const statusController = async (req: Request, res: Response, next: NextFunction) => {

	const { scenario } = req.query;
	const on_confirm = await redisFetchFromServer("on_confirm", req.body.context.transaction_id);
	if (!on_confirm) {
		return send_nack(res,"On Confirm doesn't exist")
	}
	
	req.body.on_confirm =  on_confirm;
	switch (scenario) {
		case 'completed':
			statusCompletedController(req, res, next)
			break;
		case 'in-transit':
			statusInTransitController(req, res, next)
			break;
		case 'reached-re-otp':
			statusReachedReOtpController(req, res, next)
			break;
		case 'reached':
			statusReachedController(req, res, next)
			break;
		case 'service-started':
			if (checkIfCustomized(req.body.message.providers[0].items)) {
				// return onSelectServiceCustomizedController(req, res);
			}
			statusServiceStartedController(req, res, next)
			break;
		default:
			statusCompletedController(req, res, next)//default senario : completed
			break;
	}
}

const statusCompletedController = (req: Request, res: Response, next: NextFunction) => {
	const { context,message,on_confirm } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_status/on_status_completed.yaml")
	);

	const response = YAML.parse(file.toString());
	const timestamp = new Date().toISOString();
	const status = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "on_status",
			bap_id: MOCKSERVER_ID,
			bap_uri: AGRI_SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4()
		},
		message: {
			order: {
				...response.value.message.order,
				id:on_confirm.message.order.id,
				status: response.value.message.order.status,
				provider: on_confirm.message.order.provider,
				items: on_confirm.message.order.items,
				fulfillments:response.value.message.order.fulfillments,
				quote:on_confirm.message.order.quote,
				payments: [
					{
						//hardcoded transaction_id
						...on_confirm.message.order.payments[0],
						params: {
							...on_confirm.message.order.payments[0].params,
							transaction_id: "xxxxxxxx",
						},
						status: "PAID",
					},
				],
				document:response.value.message.order.document,
				created_at: timestamp,
				updated_at: timestamp,
			},
		},
	};
	return responseBuilder(
		res,
		next,
		context,
		status.message,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"agri-services"
	);
};

const statusInTransitController = (req: Request, res: Response, next: NextFunction) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_status/on_status_In_Transit.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		next,
		context,
		response.value.message,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"agri-services"
	);
};

const statusReachedReOtpController = (req: Request, res: Response, next: NextFunction) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached_re-otp.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		next,
		context,
		response.value.message,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"agri-services"
	);
};
const statusReachedController = (
	req: Request,
	res: Response,
	next: NextFunction

) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		next,
		context,
		response.value.message,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"agri-services"
	);
};

const statusServiceStartedController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { context } = req.body;
	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_status/on_status_Service_Started.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		next,
		context,
		response.value.message,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"agri-services"
	);
};



