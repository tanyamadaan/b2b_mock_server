import { Request, Response } from "express";
import { onSelectDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const selectController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;
	var breakup: any[] = [];
	const onFulfillment = onSelectDomestic.message.order.quote.breakup.filter(
		(each) => each["@ondc/org/item_id"] === "F1"
	);
	const onItem = onSelectDomestic.message.order.quote.breakup.filter(
		(each) =>
			each["@ondc/org/item_id"] === "I1" &&
			each["@ondc/org/title_type"] !== "item"
	);
	message.order.items.forEach((item: any) => {
		breakup = [
			...breakup,
			...onItem,
			{
				"@ondc/org/item_id": item.id,
				"@ondc/org/item_quantity": {
					count: item.quantity.selected.count,
				},
				title: "Product Name Here",
				"@ondc/org/title_type": "item",
				price: {
					currency: "INR",
					value: (item.quantity.selected.count * 250).toString(),
				},
				item: {
					price: {
						currency: "INR",
						value: "250",
					},
				},
			},
		];
		item.fulfillment_ids.forEach((eachId: string) => {
			breakup = [
				...breakup,
				...onFulfillment.map(each => ({...each, "@ondc/org/item_id": eachId}))
			]
		});
	});

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
			quote: {
				breakup,
				price: {
					currency: "INR",
					value: (53_600 * message.order.items.length).toString()
				}
			}
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
