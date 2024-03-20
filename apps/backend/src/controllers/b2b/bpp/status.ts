import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

import { responseBuilder, B2B_EXAMPLES_PATH } from "../../../lib/utils";

export const statusController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "delivered":
			statusDeliveredController(req, res);
			break;
		case "out-for-delivery":
			statusOutForDeliveryController(req, res);
			break;
		case "picked-up":
			statusPickedUpController(req, res);
			break;
		case "proforma-invoice":
			statusProformaInvoiceController(req, res);
			break;
		case "bpp-payment-error":
			statusBPPpaymentErrorController(req, res);
			break;
		case "bpp-payment":
			statusBPPpaymentController(req, res);
			break;
		case "self-picked-up":
			statusSelfPickedUpController(req, res);
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

export const statusDeliveredController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_delivered.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusOutForDeliveryController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_out_for_delivery.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusPickedUpController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_picked_up.yaml")
	);

	const response = YAML.parse(file.toString());
	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusProformaInvoiceController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_proforma_invoice.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusBPPpaymentErrorController = (
	req: Request,
	res: Response
) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_BPP_payment_error.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusBPPpaymentController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_BPP_payment.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};

export const statusSelfPickedUpController = (req: Request, res: Response) => {
	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_status/on_status_self_picked_up.yaml")
	);

	const response = YAML.parse(file.toString());

	return responseBuilder(
		res,
		req.body.context,
		response.value.message,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
		}`,
		`on_status`,
		"b2b"
	);
};
