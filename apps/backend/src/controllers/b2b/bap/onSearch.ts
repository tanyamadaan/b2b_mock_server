import { Request, Response } from "express";
import { selectBapChat, selectDomestic, selectDomesticNonRFQ, selectDomesticSelfPickup, selectExports } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'domestic':
			onSearchDomesticController(req, res)
			break;
		case 'domestic-non-rfq':
			onSearchDomesticNonRfqController(req, res)
			break;
		case 'domestic-self-pickup':
			onSearchDomesticSelfPickupController(req, res)
			break;
		case 'exports':
			onSearchExportsController(req, res)
			break;
		case 'bap-chat':
			onSearchBAPchatController(req, res)
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

export const onSearchDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const responseMessage = {
		order: {
			provider: {
				id: message.catalog.providers[0].id,
				locations: [
					{
						id: message.catalog.providers[0].items[0].location_ids[0]
					}
				],
				ttl: "P1D"
			},
			items: [
				{
					...selectDomestic.message.order.items[0],
					id: message.catalog.providers[0].items[0].id,
					location_ids: [
						message.catalog.providers[0].items[0].location_ids[0]
					],
					fulfillment_ids: [
						message.catalog.providers[0].items[0].fulfillment_ids[0]
					]
				}
			],
			fulfillments: [
				{
					...selectDomestic.message.order.fulfillments[0],
					type: message.catalog.providers[0].items[0].fulfillment_ids[0]
				}
			],
			payments: [
				message.catalog.payments[0]
			],
			tags: selectDomestic.message.order.tags
		}
	}
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bpp_uri}/${ACTIONS.select}`,
		ACTIONS.select
	);
};

export const onSearchDomesticNonRfqController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		selectDomesticNonRFQ.message,
		req.body.context.bpp_uri,
		`${ACTIONS.select}`
	);
};

export const onSearchDomesticSelfPickupController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		selectDomesticSelfPickup.message,
		req.body.context.bpp_uri,
		`${ACTIONS.select}`
	);
};

export const onSearchExportsController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		selectExports.message,
		req.body.context.bpp_uri,
		`${ACTIONS.select}`
	);
};

export const onSearchBAPchatController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		selectBapChat.message,
		req.body.context.bpp_uri,
		`${ACTIONS.select}`
	);
};
