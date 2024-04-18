import { Request, Response } from "express";
import {
	quoteCreator,
	responseBuilder,
	B2B_EXAMPLES_PATH,redis
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const initController = async (req: Request, res: Response) => {
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

	const providers = parsedTransaction[0].request.message.catalog.providers
	const item_id_name = providers.map((pro: any) => {
		const mappedItems = pro.items.map((item: any) => ({
			id: item.id,
			name: item.descriptor.name,
		}));
		return mappedItems
	})

	req.body.item_arr = item_id_name.flat()


	// const { scenario } = req.query;
	// switch (scenario) {
		// case "default":
		// 	initDomesticController(req, res);
		// 	break;
		// // case "reject-rfq":
		// // 	initRejectRfq(req, res);
		// // 	break;
		// default:
			initDomesticController(req, res);
	// 		break;
	// }
};

const initDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { items, fulfillments, tags, billing, ...remainingMessage } =
		message.order;

	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_domestic.yaml")
	);

	const response = YAML.parse(file.toString());
	const { type, collected_by, ...staticPaymentInfo } =
		response.value.message.order.payments[0];
	const responseMessage = {
		order: {
			items,
			fulfillments: fulfillments.map((each: any) => ({
				...each,
				tracking: true,
			})),
			tags,
			billing,
			provider: { id: remainingMessage.provider.id },
			provider_location: remainingMessage.provider.locations[0],
			payments: remainingMessage.payments.map((each: any) => ({
				...each,
				...staticPaymentInfo,
			})),
			quote: quoteCreator(items),
		},
	};

	responseMessage.order.quote.breakup.forEach((element: any) => {
		if (element['@ondc/org/title_type'] === 'item') {
			const id = element["@ondc/org/item_id"]		
			const item = req.body.item_arr.find((item: any) => item.id == id);
			element.title = item.name
		}
	});
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
		}`,
		`on_init`,
		"b2b"
	);
};

const initRejectRfq = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { items, fulfillments, tags, billing, ...remainingMessage } =
		message.order;

	const file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_init/on_init_domestic.yaml")
	);

	const response = YAML.parse(file.toString());
	const { type, collected_by, ...staticPaymentInfo } =
		response.value.message.order.payments[0];

	const responseMessage = {
		order: {
			items,
			fulfillments: fulfillments.map((each: any) => ({
				...each,
				tracking: true,
			})),
			tags,
			billing,
			provider: { id: remainingMessage.provider.id },
			provider_location: remainingMessage.provider.locations[0],
			payments: remainingMessage.payments.map((each: any) => ({
				...each,
				...staticPaymentInfo,
			})),
			quote: quoteCreator(items),
		},
	};

	return responseBuilder(
		res,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${
			req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
		}`,
		`on_init`,
		"b2b",
		{
			type: "DOMAIN-ERROR",
			code: "50005",
			message: "Incoterm - CIF not supported",
		}
	);
};
