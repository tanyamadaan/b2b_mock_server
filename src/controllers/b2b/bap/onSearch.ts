import { Request, Response } from "express";
import { selectDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSearchController = (req: Request, res: Response) => {
	const {context, message} = req.body;
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
		context.bap_uri,
		ACTIONS.select
	);
};
