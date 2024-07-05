import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
	Fulfillment,
	quoteCreator,
	redis,
	send_nack,
	Item,
	Breakup,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

interface Item_id_name {
	[key: string]: string;
}

export const initController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { scenario } = req.query;
	const sandboxMode = res.getHeader("mode") === "sandbox";
	if(!sandboxMode) {
		try {
			const domain = req.body.context.domain;

			let response;
			let file;
			switch (domain) {
				case "ONDC:LOG10":
					file = 
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_init/"
						)
					
					break;
				case "ONDC:LOG11":
					file =
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Int_Logistics_yaml/on_init/"
						)
					
					break;
				default:
					file =
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_init/"
						)
					
					break;
			}
			switch(scenario){
        case "success":
          file = path.join(file, "on_init_air_kyc_success.yaml");
          break;
        default:
          file = path.join(file, "on_init_air.yaml");

      };
			if (!file) {
				return null; // Return null or handle this case as needed
			}
			const fileContent = fs.readFileSync(file, "utf8");
			response = YAML.parse(fileContent);
			return responseBuilder_logistics(
				res,
				next,
				response.value.context,
				response.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
				}`,
				`on_init`,
				"logistics",
				response.value.error ? response.value.error : undefined
			);
		} catch (error) {
			next(error);
		}
}else{
	try {
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
			return send_nack(res, "On Search doesn't exist");
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
		const item_id_name: Item_id_name[] = providers.map((pro: any) => {
			const mappedItems = pro.items.map((item: Item) => ({
				id: item.id,
				name: item.descriptor?.name,
			}));
			return mappedItems;
		});

		req.body.item_arr = item_id_name.flat();

		initDomesticController(req, res, next);
	} catch (error) {
		return next(error);
	}
}
};

const initDomesticController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sandboxMode = res.getHeader("mode") === "sandbox";
	if (!sandboxMode) {
		try {
			const domain = req.body.context.domain;

			var response;
			switch (domain) {
				case "ONDC:LOG10":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_init/on_init_air.yaml"
						)
					);
					response = YAML.parse(file.toString());
					break;
				case "ONDC:LOG11":
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Int_Logistics_yaml/on_init/on_init_air.yaml"
						)
					);
					response = YAML.parse(file.toString());
					break;
				default:
					var file = fs.readFileSync(
						path.join(
							LOGISTICS_EXAMPLES_PATH,
							"/B2B_Dom_Logistics_yaml/on_init/on_init_air.yaml"
						)
					);
					response = YAML.parse(file.toString());
					break;
			}

			return responseBuilder_logistics(
				res,
				next,
				response.value.context,
				response.value.message,
				`${req.body.context.bap_uri}${
					req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
				}`,
				`on_init`,
				"logistics"
			);
		} catch (error) {
			next(error);
		}
	}else{
					// const { context, message } = req.body;
			// const {
			// 	items,
			// 	providers,
			// 	fulfillments,
			// 	tags,
			// 	billing,
			// 	...remainingMessage
			// } = message.order;
			// //console.log(message);
			// let { type, collected_by, ...staticPaymentInfo } =
			// 	response.value.message.order.payments;
			// if (
			// 	remainingMessage.payments.type === "PRE-FULFILLMENT" &&
			// 	remainingMessage.payments.collected_by === "BAP"
			// ) {
			// 	staticPaymentInfo = {
			// 		...staticPaymentInfo,
			// 		"@ondc/org/settlement_details": [
			// 			{
			// 				settlement_counterparty: "buyer-app",
			// 				settlement_phase: "sale-amount",
			// 				settlement_type: "upi",
			// 				upi_address: "gft@oksbi",
			// 				settlement_bank_account_no: "XXXXXXXXXX",
			// 				settlement_ifsc_code: "XXXXXXXXX",
			// 				beneficiary_name: "xxxxx",
			// 				bank_name: "xxxx",
			// 				branch_name: "xxxx",
			// 			},
			// 		],
			// 	};
			// }
			// const responseMessage = {
			// 	order: {
			// 		items,
			// 		fulfillments: fulfillments.map((each: Fulfillment) => ({
			// 			...each,
			// 		})),
			// 		tags: [
			// 			{
			// 				descriptor: {
			// 					code: "bpp_terms",
			// 				},
			// 				list: [
			// 					{
			// 						descriptor: {
			// 							code: "max_liability",
			// 						},
			// 						value: "2",
			// 					},
			// 					{
			// 						descriptor: {
			// 							code: "max_liability_cap",
			// 						},
			// 						value: "10000",
			// 					},
			// 					{
			// 						descriptor: {
			// 							code: "mandatory_arbitration",
			// 						},
			// 						value: "false",
			// 					},
			// 					{
			// 						descriptor: {
			// 							code: "court_jurisdiction",
			// 						},
			// 						value: "Bengaluru",
			// 					},
			// 					{
			// 						descriptor: {
			// 							code: "delay_interest",
			// 						},
			// 						value: "1000",
			// 					},
			// 				],
			// 			},
			// 		],
			// 		billing,
			// 		providers,
			// 		payments: [
			// 			{
			// 				id: "P1",
			// 				...remainingMessage.payments,
			// 			},
			// 		],
			// 		quote: {
			// 			price: {
			// 				currency: "INR",
			// 				value: "6000.0",
			// 			},
			// 			breakup: [
			// 				{
			// 					item: {
			// 						id: "I3",
			// 					},
			// 					title: "delivery",
			// 					price: {
			// 						currency: "INR",
			// 						value: "5000.0",
			// 					},
			// 				},
			// 				{
			// 					item: {
			// 						id: "I3",
			// 					},
			// 					title: "tax",
			// 					price: {
			// 						currency: "INR",
			// 						value: "500.0",
			// 					},
			// 				},
			// 				{
			// 					item: {
			// 						id: "I3",
			// 					},
			// 					title: "insurance",
			// 					price: {
			// 						currency: "INR",
			// 						value: "480.0",
			// 					},
			// 				},
			// 			],
			// 			ttl: "PT15M",
			// 		},
			// 		...remainingMessage.xinput,
			// 	},
			// };
	}
};
