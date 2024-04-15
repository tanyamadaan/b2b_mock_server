import { Request, Response } from "express";
import {
	quoteCreator,
	responseBuilder
} from "../../../lib/utils";

export const selectController = (req: Request, res: Response) => {
	const { scenario } = req.query;
	switch (scenario) {
		case "default":
			selectDomesticController(req, res);
			break;
		case "non-serviceable":
			selectNonServiceableController(req, res);
			break;
		case "quantity-unavailable":
			selectQuantityUnavailableController(req, res);
			break;
		default:
			selectDomesticController(req, res);
			break;
	}
};

export const selectDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;

	var responseMessage = {
		order: {
			provider,
			payments: [message.order.payments[0]],
			items: message.order.items.map(
				({
					location_ids,
					add_ons,
					...remaining
				}: {
					location_ids: any;
					add_ons: any;
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


export const selectNonServiceableController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;

	var responseMessage = {
		order: {
			provider,
			payments: message.order.payments[0],
			items: message.order.items.map(
				({
					location_ids,
					add_ons,
					...remaining
				}: {
					location_ids: any;
					add_ons: any;
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
						code: "Non-Serviceable",
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
		"b2b",
		{
			"type": "DOMAIN-ERROR",
			"code": "30009",
			"message": "Item not Serviceable"
		}
	);
};

export const selectQuantityUnavailableController = (
	req: Request,
	res: Response
) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;

	var responseMessage = {
		order: {
			provider,
			payments: message.order.payments[0],
			items: message.order.items.map(
				({
					location_ids,
					add_ons,
					...remaining
				}: {
					location_ids: any;
					add_ons: any;
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
		"b2b",
		{
			"type": "DOMAIN-ERROR",
			"code": "40002",
			"message": "Quantity Unavailable"
		}
	);
};

