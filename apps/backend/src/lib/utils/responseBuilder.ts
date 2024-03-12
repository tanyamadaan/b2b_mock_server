import axios from "axios";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	BAP_MOCKSERVER_URL,
	BPP_MOCKSERVER_URL,
	MOCKSERVER_ID,
} from "./constants";
import { createResponseAuthHeader } from "./responseAuth";
import { TransactionType, redis } from "./redis";

interface TagDescriptor {
	code: string;
}

interface TagList {
	descriptor: TagDescriptor;
	value: string;
}

interface Quantity {
	selected: {
		count: number;
	};
}

interface AddOn {
	id: string;
}

interface Tag {
	descriptor: TagDescriptor;
	list: TagList[];
}

interface Item {
	fulfillment_ids: string[];
	id: string;
	quantity: Quantity;
	add_ons: AddOn[];
	tags: Tag[];
}

export const responseBuilder = async (
	res: Response,
	reqContext: object,
	message: object,
	uri: string,
	action: string
) => {
	var totalTransaction: TransactionType = res.locals.logs;
	res.locals = {};
	var ts = new Date((reqContext as any).timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
	const sandboxMode = res.getHeader("mode") === "sandbox";
	// console.log("SANDBOX>", sandboxMode);
	var async: { message: object; context?: object } = { context: {}, message };

	if (action.startsWith("on_")) {
		// const { bap_uri, bap_id, ...remainingContext } = reqContext as any;
		async = {
			...async,
			context: {
				// ...remainingContext,
				...reqContext,
				bpp_id: MOCKSERVER_ID,
				bpp_uri: BPP_MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
				action,
			},
		};
	} else {
		// const { bpp_uri, bpp_id, ...remainingContext } = reqContext as any;
		async = {
			...async,
			context: {
				// ...remainingContext,
				...reqContext,
				bap_id: MOCKSERVER_ID,
				bap_uri: BAP_MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
				message_id: uuidv4(),
				action,
			},
		};
	}
	const header = await createResponseAuthHeader(async);
	res.setHeader("authorization", header);

	if (sandboxMode) {
		if (totalTransaction?.logs) {
			totalTransaction.logs = {
				...totalTransaction.logs,
				[action]: async,
			};
		} else {
			totalTransaction = { actions: [action], logs: { [action]: async } };
		}
		if (!totalTransaction.actions.includes(action)) {
			totalTransaction.actions.push(action);
		}
		await redis.set(
			(async.context! as any).transaction_id,
			JSON.stringify(totalTransaction)
		);
		console.log("HERE");
		try {
			console.log("ASYNC BEING SENT", async);
			const response = await axios.post(uri, async, {
				headers: {
					authorization: header,
				},
			});
		} catch (error) {
			console.log("URI Pinged", uri);
			console.log(
				"ERROR OCCURRED WHILE PINGING SANDBOX RESPONSE",
				(error as any).response.data,
				(error as any).response.data.error.message,
			);

			return res.json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					// message: (error as any).message,
					message: (error as any).response.data,
				},
				async,
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

export const quoteCreator = (items: Item[]) => {
	var breakup: any[] = [];
	const chargesOnFulfillment = [
		{
			"@ondc/org/item_id": "F1",
			title: "Delivery charges",
			"@ondc/org/title_type": "delivery",
			price: {
				currency: "INR",
				value: "4000",
			},
		},
		{
			"@ondc/org/item_id": "F1",
			title: "Packing charges",
			"@ondc/org/title_type": "packing",
			price: {
				currency: "INR",
				value: "500",
			},
		},
		{
			"@ondc/org/item_id": "F1",
			title: "Convenience Fee",
			"@ondc/org/title_type": "misc",
			price: {
				currency: "INR",
				value: "100",
			},
		},
	];
	const chargesOnItem = [
		{
			"@ondc/org/item_id": "I1",
			title: "Tax",
			"@ondc/org/title_type": "tax",
			price: {
				currency: "INR",
				value: "0",
			},
		},
		{
			"@ondc/org/item_id": "I1",
			title: "Discount",
			"@ondc/org/title_type": "discount",
			price: {
				currency: "INR",
				value: "-1000",
			},
		},
	];
	items.forEach((item: any) => {
		breakup = [
			...breakup,
			...chargesOnItem,
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
				...chargesOnFulfillment.map((each) => ({
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
