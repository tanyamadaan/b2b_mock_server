import { Request, Response } from "express";
import { quoteCreator, responseBuilder, redis } from "../../../lib/utils";

export const selectController = async (req: Request, res: Response) => {
	const { scenario } = req.query;
	const { transaction_id } = req.body.context;

	const transactionKeys = await redis.keys(`${transaction_id}-*`);
	const ifToTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_search-to-server")
	);

	const ifFromTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_search-from-server")
	);

	if (
		ifFromTransactionExist.length === 0 &&
		ifToTransactionExist.length === 0
	) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "on search doesn't exist",
			},
		});
	}
	const transaction = await redis.mget(
		ifFromTransactionExist.length > 0
			? ifFromTransactionExist
			: ifToTransactionExist
	);
	const parsedTransaction = transaction.map((ele) => {
		return JSON.parse(ele as string);
	});

	const providers = parsedTransaction[0].request.message.catalog.providers;
	const item_id_name = providers.map((pro: any) => {
		const mappedItems = pro.items.map((item: any) => ({
			id: item.id,
			name: item.descriptor.name,
		}));
		return mappedItems;
	});

	req.body.item_arr = item_id_name.flat();

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
	try {
		responseMessage.order.quote.breakup.forEach((element: any) => {
			if (element["@ondc/org/title_type"] === "item") {
				const id = element["@ondc/org/item_id"];
				const item = req.body.item_arr.find((item: any) => item.id == id);
				element.title = item.name;
			}
		});
	} catch (error) {
		console.log("ERROR Occurred while matching item ID and name:::", error)
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "Item Name and ID not matching",
			},
		});
	}
	
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
			type: "DOMAIN-ERROR",
			code: "30009",
			message: "Item not Serviceable",
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
			type: "DOMAIN-ERROR",
			code: "40002",
			message: "Quantity Unavailable",
		}
	);
};
