import { Request, Response } from "express";
import { initDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSelectController = (req: Request, res: Response) => {
	const {
		context,
		message: {
			order: { provider, items, payments, fulfillments },
		},
	} = req.body;
	const responseMessage = {
		order: {
			...initDomestic.message.order,
			provider,
			items,
			payments,
			fulfillments: fulfillments.map((fulfillment: any) => ({
				...initDomestic.message.order.fulfillments[0],
				id: fulfillment.id,
			})),
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		context.bap_uri,
		ACTIONS.init
	);
};
