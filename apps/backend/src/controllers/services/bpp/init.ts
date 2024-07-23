import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	quoteCreatorHealthCareService,
	responseBuilder,
	send_nack,
	AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
	redisFetchFromServer,
	updateFulfillments,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { PAYMENT_TYPE } from "../../../lib/utils/apiConstants";

export const initController = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const { transaction_id } = req.body.context;
		const {scenario} = req.query;
		const on_search = await redisFetchFromServer(ON_ACTION_KEY.ON_SEARCH, transaction_id);
		if (!on_search) {
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED)
		}
		const providersItems = on_search?.message?.catalog?.providers[0]?.items;
		req.body.providersItems = providersItems

		const on_select = await redisFetchFromServer(ON_ACTION_KEY.ON_SELECT, transaction_id);

		if (on_select && on_select?.error) {
			return send_nack(res, on_select?.error?.message?on_select?.error?.message:ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED)
		}

		if (!on_select) {
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED)
		}

		switch (scenario){

			//SERVICES

			

			//EQUIPMENT HIRING 
			case "availability_changes_during_the_transaction_journey":
			initItemNotAvaliableController(req,res,next);
			break;
			default:
				return initConsultationController(req, res, next);
		}
	}catch(error){
		return next(error)
	}
	
};

const initConsultationController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { context, providersItems, message: { order: { provider, items, billing, fulfillments, payments } } } = req.body;
		const { locations, ...remainingProvider } = provider;

		const updatedFulfillments = updateFulfillments(fulfillments, ON_ACTION_KEY?.ON_INIT);

		const file = fs.readFileSync(
			path.join(AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, "on_init/on_init.yaml")
		);
	
		const response = YAML.parse(file.toString());
		const quoteData = quoteCreatorHealthCareService(items, providersItems,"",	fulfillments[0]?.type,"agri-equipment-hiring")

		const responseMessage = {
			order: {
				provider: remainingProvider,
				locations,
				items,
				billing,
				fulfillments: updatedFulfillments,
				quote: quoteData,

				//UPDATE PAYMENT OBJECT WITH REFUNDABLE SECURITY

				payments: [
					response?.value?.message?.order?.payments[0],
					{
					id: response?.value?.message?.order?.payments[1]?.id,
					type: PAYMENT_TYPE.ON_FULFILLMENT,
					collected_by: response?.value?.message?.order?.payments[0]?.collected_by,
					params: {
						amount: (Number(quoteData?.price?.value) - 5000).toString(),
						currency: quoteData?.price?.currency,
						bank_account_number: response?.value?.message?.order?.payments[1]?.params?.bank_account_number,
						virtual_payment_address: response?.value?.message?.order?.payments[1]?.params?.virtual_payment_address
					},
					tags: response?.value?.message?.order?.payments[1]?.tags
				}
			],
				// payments: [{
				// 	id: response?.value?.message?.order?.payments[0]?.id,
				// 	type: payments[0]?.type,
				// 	collected_by: payments[0]?.collected_by,
				// 	params: {
				// 		amount: quoteData?.price?.value,
				// 		currency: quoteData?.price?.currency,
				// 		bank_account_number: response?.value?.message?.order?.payments[0]?.params?.bank_account_number,
				// 		virtual_payment_address: response?.value?.message?.order?.payments[0]?.params?.virtual_payment_address
				// 	},
				// 	tags: response?.value?.message?.order?.payments[0]?.tags
				// }],
			}
		}

		delete req.body?.providersItems
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_INIT: `/${ON_ACTION_KEY.ON_INIT}`
			}`,
			`${ON_ACTION_KEY.ON_INIT}`,
			"agri-equipment-hiring"
		);
	}catch(error){
		next(error)
	}
	
};

const initItemNotAvaliableController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { context, providersItems, message: { order: { provider, items, billing, fulfillments, payments } } } = req.body;
		const { locations, ...remainingProvider } = provider;

		items.forEach((item: any) => {
			// Find the corresponding item in the second array
			if (providersItems) {
				const matchingItem = providersItems.find(
					(secondItem: { id: string }) => secondItem.id === item.id
				);
				// If a matching item is found, update the price in the items array
				if (matchingItem) {
					item.time = matchingItem?.time;
				}
			}
		});

		const updatedFulfillments = updateFulfillments(fulfillments, ON_ACTION_KEY?.ON_INIT);

		const file = fs.readFileSync(
			path.join(AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, "on_init/on_init.yaml")
		);
	
		const response = YAML.parse(file.toString());
		const quoteData = quoteCreatorHealthCareService(items, providersItems,"",	fulfillments[0]?.type,"agri-equipment-hiring")

		const responseMessage = {
			order: {
				provider: remainingProvider,
				locations,
				items: items.map(
					({ ...remaining }: { location_ids: any; remaining: any }) => ({
						...remaining,
					})
				),
				billing,
				fulfillments: updatedFulfillments,
				// quote: quoteData,
				payments: [{
					id: response?.value?.message?.order?.payments[0]?.id,
					type: payments[0]?.type,
					collected_by: payments[0]?.collected_by,
					params: {
						amount: quoteData?.price?.value,
						currency: quoteData?.price?.currency,
						bank_account_number: response?.value?.message?.order?.payments[0]?.params?.bank_account_number,
						virtual_payment_address: response?.value?.message?.order?.payments[0]?.params?.virtual_payment_address
					},
					tags: response?.value?.message?.order?.payments[0]?.tags
				}],
			}
		}

		const error = {
			code: "90002",
			message: ERROR_MESSAGES.EQUIPMENT_NOT_LONGER_AVALIABLE,
		}
		delete req.body?.providersItems
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_INIT: `/${ON_ACTION_KEY.ON_INIT}`
			}`,
			`${ON_ACTION_KEY.ON_INIT}`,
			"agri-equipment-hiring",
			error
		);
	}catch(error){
		next(error)
	}
};

