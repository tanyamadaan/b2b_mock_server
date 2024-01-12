import { Request, Response } from "express";
import {
	onStatusDelivered,
	onStatusOutForDelivery,
	onStatusPickedUp,
	onStatusProformaInvoice,
} from "../../../lib/examples";

import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const statusDeliveredController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusDelivered.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusOutForDeliveryController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusOutForDelivery.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusPickedUpController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusPickedUp.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusProformaInvoiceController = (
	req: Request,
	res: Response
) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusProformaInvoice.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};
