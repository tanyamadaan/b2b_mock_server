import { Request, Response } from "express";
import { onInitDomestic } from "../../../lib/examples";
import { ACTIONS, quoteCreator, responseBuilder } from "../../../lib/utils";

export const initController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { items, fulfillments, tags, billing, ...remainingMessage } =
		message.order;
	const {type, collected_by, ...staticPaymentInfo} = onInitDomestic.message.order.payments[0];
	const responseMessage = {
		order: {
			items,
			fulfillments,
			tags,
			billing,
			provider: {id: remainingMessage.provider.id},
			provider_location: remainingMessage.provider.locations[0],
			payments: remainingMessage.payments.map((each: any) => ({...each, ...staticPaymentInfo})),
			quote: quoteCreator(items)
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		context.bap_uri,
		`on_${ACTIONS.init}`
	);
};
