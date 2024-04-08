import { Request, Response } from "express";
import {
	quoteCreator,
	B2B_EXAMPLES_PATH,
	responseBuilder,
	logger,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const selectController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		// case "rfq":
		// 	selectDomesticController(req, res);
		// 	break;
		// case "non-rfq":
		// 	selectDomesticNonRfqController(req, res);
		// 	break;
		case "self-pickup":
			selectDomesticSelfPickupController(req, res);
			break;
		// case "exports":
		// 	selectExportsController(req, res);
		// 	break;
		case "non-serviceable":
			selectNonServiceableController(req, res);
			break;
		case "quantity-unavailable":
			selectQuantityUnavailableController(req, res);
			break;
		case "prepaid-bap-non-rfq":
			selectPrepaidBapNonRFQController(req, res);
			break;
		case "prepaid-bap":
			selectPrepaidBapController(req, res);
			break;
		default:
			selectDomesticController(req, res);
			break;
	}
};

export const selectDomesticController = (req: Request, res: Response) => {
	logger.info({
		type: "response",
		message: { action: req.body.context, mode: req.query.mode },
	});

	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;

	var responseMessage = {
		order: {
			provider,
			payments: message.order.payments.map(({ type }: { type: string }) => ({
				type,
				collected_by: "BPP",
			})),
			items: message.order.items.map(
				({
					location_ids,
					...remaining
				}: {
					location_ids: any;
					remaining: any;
				}) => ({
					...remaining,
				})
			),
			fulfillments: message.order.fulfillments.map(({ id, ...each }: any) => ({
				id,
				tracking: false,
				"@ondc/org/provider_name": "ONDC Mock Server",
				"@ondc/org/category": "Express Delivery",
				"@ondc/org/TAT": "P7D",
				state: {
					descriptor: {
						code: "Serviceable",
					},
				},
			})),
			quote: quoteCreator(message.order.items),
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

const selectDomesticNonRfqController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_select/on_select_domestic_non_rfq.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectDomesticSelfPickupController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(
			B2B_EXAMPLES_PATH,
			"on_select/on_select_domestic_self_pickup.yaml"
		)
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectExportsController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_select/on_select_exports.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectNonServiceableController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_select/on_select_non_serviceable.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		{message: response.value.message, error: response.value.error},
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectQuantityUnavailableController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(
			B2B_EXAMPLES_PATH,
			"on_select/on_select_quantity_unavailable.yaml"
		)
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		{message: response.value.message, error: response.value.error},
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectPrepaidBapNonRFQController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_select/on_select_prepaid_bap_non_rfq.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};

export const selectPrepaidBapController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_select/on_select_prepaid_bap.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
		}`,
		`on_select`,
		"b2b"
	);
};
