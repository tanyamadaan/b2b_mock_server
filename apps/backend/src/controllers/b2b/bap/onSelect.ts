import { Request, Response } from "express";
import { ACTIONS, responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onSelectController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'rfq':
			onSelectDomesticController(req, res)
			break;
		case 'non-rfq':
			onSelectDomesticNonRfqController(req, res)
			break;
		case 'exports':
			onSelectExportsController(req, res)
			break;
		case 'bpp-payment':
			onSelectDomesticBPPPaymentController(req, res)
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

export const onSelectDomesticController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "init/init_domestic.yaml")
	);
	const response = YAML.parse(file.toString());

	const {
		context,
		message: {
			order: { provider, items, payments, fulfillments },
		},
	} = req.body;
	const responseMessage = {
		order: {
			...response.value.message.order,
			provider,
			items,
			payments,
			fulfillments: fulfillments.map((fulfillment: any) => ({
				...response.value.message.order.fulfillments[0],
				id: fulfillment.id,
			})),
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bpp_uri}/${ACTIONS.init}`,
		ACTIONS.init
	);
};

export const onSelectDomesticNonRfqController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "init/init_domestic_non_rfq.yaml")
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};

export const onSelectExportsController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "init/init_exports.yaml")
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};

export const onSelectDomesticBPPPaymentController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "init/init_domestic_BPP_payment.yaml")
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};
