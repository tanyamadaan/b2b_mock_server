import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	quoteCreatorHealthCareService,
	redisFetchFromServer,
	send_nack,
	checkSelectedItems,
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
			case "no_equipment_avaliable":
				onSelectNoEquipmentAvaliable(req, res, next);
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

		const updatedFulfillments = updateFulfillments(
			message?.order?.fulfillments,
			ON_ACTION_KEY?.ON_SELECT
		);

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
					message?.order?.items,
					providersItems?.items,
					providersItems?.offers,
					message?.order?.fulfillments[0]?.type,
					"agri-equipment-hiring"
				),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_SELECT
					: `/${ON_ACTION_KEY.ON_SELECT}`
			}`,
			`${ON_ACTION_KEY.ON_SELECT}`,
			"agri-equipment-hiring"
		);
	} catch (error) {
		next(error);
	}
};

const onSelectNoEquipmentAvaliable = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message, providersItems } = req.body;

		//Set available schedule time of items
		message?.order?.items.forEach((item: any) => {
			// Find the corresponding item in the second array
			if (providersItems?.items) {
				const matchingItem = providersItems?.items.find(
					(secondItem: { id: string }) => secondItem.id === item.id
				);
				// If a matching item is found, update the price in the items array
				if (matchingItem) {
					item.time = matchingItem?.time;
				}
			}
		});

		const updatedFulfillments = updateFulfillments(
			req.body?.message?.order?.fulfillments,
			ON_ACTION_KEY?.ON_SELECT
		);

		const { locations, ...provider } = message.order.provider;

		const responseMessage = {
			order: {
				provider,
				payments: message?.order?.payments.map(
					({ type }: { type: string }) => ({
						type,
						collected_by: "BAP",
					})
				),

				items: message?.order?.items.map(
					({ ...remaining }: { location_ids: any; remaining: any }) => ({
						...remaining,
					})
				),

				fulfillments: updatedFulfillments,

				// quote: quoteCreatorHealthCareService(
				// 	message.order.items,
				// 	providersItems?.items,
				// 	providersItems?.offers,
				// 	message?.order?.fulfillments[0]?.type
				// ),
			},
		};

		const error = {
			code: "90001",
			message: ERROR_MESSAGES.EQUIPMENT_NOT_AVALIABLE,
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${context.bap_uri}/${ON_ACTION_KEY.ON_SELECT}`,
			`${ON_ACTION_KEY.ON_SELECT}`,
			"agri-equipment-hiring",
			error
		);
	} catch (error) {
		next(error);
	}
};
