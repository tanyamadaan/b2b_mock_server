
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { NextFunction, Request, Response } from "express";
import {
	SERVICES_EXAMPLES_PATH,
	checkIfCustomized,
	quoteCreatorAgriService,
	quoteCreatorServiceCustomized,
	responseBuilder,
	send_nack,
	redisExistFromServer,
	AGRI_SERVICES_EXAMPLES_PATH,
	redisFetchFromServer
} from "../../../lib/utils";

export const initController = async (req: Request, res: Response, next: NextFunction) => {
	const { transaction_id } = req.body.context;
	
	const on_search = await redisFetchFromServer("on_search", transaction_id);
	const providersItems = on_search?.message?.catalog?.providers[0]?.items;
	req.body.providersItems = providersItems

	const exit=await redisExistFromServer("on_select",transaction_id);

	if (!exit){
		send_nack(res,"On Select doesn't exist")
	}
	
	if (checkIfCustomized(req.body.message.order.items)) {
		return initServiceCustomizationController(req, res, next);
	}
	return initConsultationController(req, res, next);
};


const initConsultationController = (req: Request, res: Response, next: NextFunction) => {
	const { context,providersItems,message: { order: { provider, items, billing, fulfillments, payments } } } = req.body;
	const { locations, ...remainingProvider } = provider
	const { stops, ...remainingfulfillments } = fulfillments[0]

	const file = fs.readFileSync(
		path.join(AGRI_SERVICES_EXAMPLES_PATH, "on_init/on_init.yaml")
	);
	const response = YAML.parse(file.toString());
	const quoteData = quoteCreatorAgriService(items,providersItems)

	const responseMessage = {
		order: {
			provider: remainingProvider,
			locations,
			items,
			billing,
			fulfillments: [{
				...remainingfulfillments,
				tracking: false,
				stops: stops.map((stop: any) => {
					return {
						...stop,
						tags: {
							"descriptor": {
								"code": "schedule"
							},
							"list": [
								{
									"descriptor": {
										"code": "ttl"
									},
									"value": "PT1H"
								}
							]
						}
					}
				})
			}],
			quote: quoteData,
			payments: [{
				id: response.value.message.order.payments[0]?.id,
				type: payments[0].type,
				collected_by:payments[0].collected_by,
				params:{
					amount:quoteData?.price?.value,
					currency: quoteData?.price?.currency,
					bank_account_number:response.value.message.order.payments[0]?.params.bank_account_number,
					virtual_payment_address: response.value.message.order.payments[0]?.params.virtual_payment_address
				},
				tags:response.value.message.order.payments[0].tags
			}],
			xinput: response.value.message.order.xinput
		}
	}

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
		}`,
		`on_init`,
		"agri-services"
	);
};

const initServiceCustomizationController = (req: Request, res: Response, next: NextFunction) => {

	const { context, message: { order: { provider, items, billing, fulfillments, payments } } } = req.body;

	const { locations, ...remainingProvider } = provider
	const { stops, ...remainingfulfillments } = fulfillments[0]

	const file = fs.readFileSync(
		path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init.yaml")
	);
	const response = YAML.parse(file.toString());
	// splice to insert element at index 0
	stops.splice(0, 0, {
		"type": "start",
		"instructions": {
			"name": "Instuctions by provider",
			"short_desc": "Instuctions by provider",
			"long_desc": "Instuctions by provider",
			"additional_desc": {
				"url": "https//abc.com/checklist",
				"content_type": "text/html"
			}
		}
	})
	const responseMessage = {
		order: {
			provider: remainingProvider,
			locations,
			items: items,
			billing,
			fulfillments: [{
				...remainingfulfillments,
				"tracking": false,
				stops
			}],
			quote: quoteCreatorServiceCustomized(items),
			payments: [{
				id: payments[0].id,
				type: payments[0].type,
				...response.value.message.order.payments[0]
			}],
			xinput: response.value.message.order.xinput
		}
	}

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
		}`,
		`on_init`,
		"agri-services"
	);
};
