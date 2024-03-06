import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	ACTIONS,
	responseBuilder,
	B2B_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onInitController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "rfq":
			onInitDomesticController(req, res);
			break;
		case "non-rfq":
			onInitDomesticNonRfqController(req, res);
			break;
		case "exports":
			onInitExportsController(req, res);
			break;
		case "prepaid-bap-non-rfq":
			onInitPrepaidBapNonRFQController(req, res);
			break;
		case "prepaid-bap-rfq":
			onInitPrepaidBapRFQController(req, res);
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

export const onInitDomesticController = (req: Request, res: Response) => {
	const {
		context,
		message: {
			order: { provider, provider_location, ...order },
		},
	} = req.body;
	const timestamp = new Date().toISOString();
	const responseMessage = {
		order: {
			...order,
			id: uuidv4(),
			state: "Created",
			provider: {
				id: provider.id,
				locations: [
					{
						...provider_location,
					},
				],
			},
			fulfillments: order.fulfillments.map(
				({ id, type, tracking, stops }: any) => ({
					id,
					type,
					tracking,
					stops,
				})
			),
			payments: [
				{
					params: {
						...order.quote.price,
					},
					...order.payments[0],
				},
			],
			created_at: timestamp,
			updated_at: timestamp,
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/${ACTIONS.confirm}`,
		ACTIONS.confirm
	);
};

export const onInitDomesticNonRfqController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "confirm/confirm_domestic_Non_RFQ.yaml")
	);
	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};

export const onInitExportsController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "confirm/confirm_exports.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};

export const onInitPrepaidBapNonRFQController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "confirm/confirm_prepaid_bap_non_rfq.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};

export const onInitPrepaidBapRFQController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "confirm/confirm_prepaid_bap_rfq.yaml")
	);
	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};
