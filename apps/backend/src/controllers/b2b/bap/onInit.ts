import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";
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
			onInitDomesticController(req, res);
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
					...order.payments[0],
					params: {
						currency: order.quote.price.currency,
						amount: order.quote.price.value,
					},
					status: "NOT-PAID",
					"@ondc/org/settlement_details": [
						{
							settlement_counterparty: "buyer-app",
							settlement_phase: "sale-amount",
							settlement_type: "upi",
							upi_address: "gft@oksbi",
							settlement_bank_account_no: "XXXXXXXXXX",
							settlement_ifsc_code: "XXXXXXXXX",
							beneficiary_name: "xxxxx",
							bank_name: "xxxx",
							branch_name: "xxxx",
						},
					],
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
		`${context.bpp_uri}/confirm`,
		`confirm`,
		"b2b"
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
		`confirm`,
		"b2b"
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
		`confirm`,
		"b2b"
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
		`confirm`,
		"b2b"
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
		`confirm`,
		"b2b"
	);
};
