import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import YAML from "yaml";
import {
	SERVICES_EXAMPLES_PATH,
	responseBuilder,
	quoteCreatorHealthCareService,
	quoteCreatorServiceCustomized,
	checkIfCustomized,
	redis,
	redisFetchFromServer,
	send_nack,
	checkSelectedItems,
	HEALTHCARE_SERVICES_EXAMPLES_PATH,
	updateFulfillments,
} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const selectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const on_search = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SEARCH,
			req.body.context.transaction_id
		);

		if (!on_search) {
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
		}
		const providersItems = on_search?.message?.catalog?.providers[0];
		req.body.providersItems = providersItems;
		const checkItemExistInSearch = await checkSelectedItems(req.body);
		if (!checkItemExistInSearch) {
			return send_nack(res, ERROR_MESSAGES.SELECTED_ITEMS_DOES_NOT_EXISTED);
		}
		const { scenario } = req.query;
		switch (scenario) {
			case "multi_collection":
				selectMultiCollectionController(req, res, next);
				break;
			default:
				return selectConsultationConfirmController(req, res, next);
		}
	} catch (error) {
		return next(error);
	}
};

const selectConsultationConfirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message, providersItems } = req.body;
		const { locations, ...provider } = message.order.provider;
		const updatedFulfillments = updateFulfillments(message?.order?.fulfillments, ON_ACTION_KEY?.ON_SELECT)

		const responseMessage = {
			order: {
				provider,
				payments: message.order.payments.map(({ type }: { type: string }) => ({
					type,
					collected_by: "BAP",
				})),

				items: message.order.items.map(
					({ ...remaining }: { location_ids: any; remaining: any }) => ({
						...remaining,
					})
				),

				fulfillments: updatedFulfillments,
				quote: quoteCreatorHealthCareService(
					message.order.items,
					providersItems?.items,
					providersItems?.offers,
					message?.order?.fulfillments[0]?.type
				),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_SELECT : `/${ON_ACTION_KEY.ON_SELECT}`
			}`,
			`${ON_ACTION_KEY.ON_SELECT}`,
			"healthcare-service"
		);
	} catch (error) {
		next(error);
	}
};

const selectMultiCollectionController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message, providersItems } = req.body;
		const updatedFulfillments = updateFulfillments(req.body?.message?.order?.fulfillments, ON_ACTION_KEY?.ON_SELECT, "multi_collection")

		const { locations, ...provider } = message.order.provider;

		const responseMessage = {
			order: {
				provider,
				payments: message?.order?.payments.map(({ type }: { type: string }) => ({
					type,
					collected_by: "BAP",
				})),

				items: message?.order?.items.map(
					({ ...remaining }: { location_ids: any; remaining: any }) => ({
						...remaining,
					})
				),
				fulfillments: updatedFulfillments,

				quote: quoteCreatorHealthCareService(
					message.order.items,
					providersItems?.items,
					providersItems?.offers,
					message?.order?.fulfillments[0]?.type
				),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${context.bap_uri}/${ON_ACTION_KEY.ON_SELECT}`,
			`${ON_ACTION_KEY.ON_SELECT}`,
			"healthcare-service"
		);
	} catch (error) {
		next(error);
	}
};
