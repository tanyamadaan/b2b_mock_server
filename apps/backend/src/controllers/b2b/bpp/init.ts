import { Request, Response } from "express";
import {
	quoteCreator,
	responseBuilder,
	B2B_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const initController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "rfq":
			initDomesticController(req, res);
			break;
		case "non-rfq":
			initDomesticNonRfq(req, res);
			break;
		case "payment-bpp-non-rfq":
			initDomesticPaymentBppNonRfq(req, res);
			break;
		case "self-pickup":
			initDomesticSelfPickup(req, res);
			break;
		case "exports":
			initExports(req, res);
			break;
		case "reject-rfq":
			initRejectRfq(req, res);
			break;
		default:
			initDomesticController(req, res);
			break;
	}
};

export const initDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { items, fulfillments, tags, billing, ...remainingMessage } =
		message.order;

	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_domestic.yaml")
	);

	const response = YAML.parse(file.toString());
	const { type, collected_by, ...staticPaymentInfo } =
		response.value.message.order.payments[0];
	const responseMessage = {
		order: {
			items,
			fulfillments: fulfillments.map((each: any) => ({
				...each,
				tracking: true,
			})),
			tags,
			billing,
			provider: { id: remainingMessage.provider.id },
			provider_location: remainingMessage.provider.locations[0],
			payments: remainingMessage.payments.map((each: any) => ({
				...each,
				...staticPaymentInfo,
			})),
			quote: quoteCreator(items),
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};

export const initDomesticNonRfq = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_domestic_non_rfq.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};

export const initDomesticPaymentBppNonRfq = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(
			B2B_EXAMPLES_PATH,
			"on_init/on_init_domestic_payment_BPP_Non_RFQ.yaml"
		)
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};

export const initDomesticSelfPickup = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_domestic_self_pickup.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};

export const initExports = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_exports.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};

export const initRejectRfq = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_rejectRFQ.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}/on_init`,
		`on_init`,
		"b2b"
	);
};
