import { Request, Response } from "express";
import { onSelectDomestic } from "../../../lib/examples";
import { ACTIONS, quoteCreator, responseBuilder } from "../../../lib/utils";

export const selectController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;


	var responseMessage = {
		order: {
			provider,
			payments: message.order.payments.map(({ type }: { type: string }) => ({
				type,
				collected_by: "BPP",
			})),
			items: message.items.map(
				({
					location_ids,
					...remaining
				}: {
					location_ids: any;
					remaining: any;
				}) => ({
					remaining,
				})
			),
			fulfillments: message.fulfillments,
			quote: quoteCreator(message.order.items)
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		context.bap_uri,
		`on_${ACTIONS.select}`
	);
};
