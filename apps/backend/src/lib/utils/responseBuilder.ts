import axios from "axios";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MOCKSERVER_ID, MOCKSERVER_URL } from "./constants";
import { createResponseAuthHeader } from "./responseAuth";
import { onSelectDomestic } from "../examples";

export const responseBuilder = async (
	res: Response,
	reqContext: object,
	message: object,
	uri: string,
	action: string
) => {
	var ts = new Date((reqContext as any).timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
	const sandboxMode = res.getHeader("mode") === "sandbox";
	// console.log("SANDBOX>", sandboxMode);
	var async: { message: object; context?: object } = { context: {}, message };

	if (!action.startsWith("on_")) {
		const { bap_uri, bap_id, ...context } = reqContext as any;
		async = {
			...async,
			context: {
				...context,
				bpp_id: MOCKSERVER_ID,
				bpp_uri: MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
				action,
			},
		};
	} else {
		const { bpp_uri, bpp_id, ...context } = reqContext as any;
		async = {
			...async,
			context: {
				...context,
				bap_id: MOCKSERVER_ID,
				bap_uri: MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
				message_id: uuidv4(),
				action
			},
		};
	}
	const header = await createResponseAuthHeader(async);
	res.setHeader("authorization", header);
	if (sandboxMode) {
		try {
			const response = await axios.post(uri, async, {
				headers: {
					authorization: header,
				},
			});
			
		} catch (error) {
			console.log("ERROR Occured", (error as any).message);
			return res.json({
				message: {
					ack: {
						status: "NACK"
					},
				},
				error: {
					message: (error as any).message
				}
			});
		}

		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
		});
	} else {
		return res.json({
			sync: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			async,
		});
	}
};

export const quoteCreator = (
	items: typeof onSelectDomestic.message.order.items
) => {
	var breakup: any[] = [];
	const onFulfillment = onSelectDomestic.message.order.quote.breakup.filter(
		(each) => each["@ondc/org/item_id"] === "F1"
	);
	const onItem = onSelectDomestic.message.order.quote.breakup.filter(
		(each) =>
			each["@ondc/org/item_id"] === "I1" &&
			each["@ondc/org/title_type"] !== "item"
	);
	items.forEach((item: any) => {
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
				...onFulfillment.map((each) => ({
					...each,
					"@ondc/org/item_id": eachId,
				})),
			];
		});
	});
	return {
		breakup,
		price: {
			currency: "INR",
			value: (53_600 * items.length).toString(),
		},
		ttl: "P1D",
	};
};
