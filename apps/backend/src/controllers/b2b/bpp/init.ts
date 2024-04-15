import { Request, Response } from "express";
import {
	quoteCreator,
	responseBuilder,
	B2B_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const initController = (req: Request, res: Response) => {
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
