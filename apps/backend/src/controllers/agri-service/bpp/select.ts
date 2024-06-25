import { NextFunction, Request, Response } from "express";

import {
	responseBuilder,
	redisFetchFromServer,
	quoteCreatorHealthCareService,
	checkSelectedItems,
	send_nack,
} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const selectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const on_search = await redisFetchFromServer(
			ON_ACTTION_KEY.ON_SEARCH,
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
			// schedule_confirmed, schedule_rejected
			case "schedule_confirmed":
				selectConsultationConfirmController(req, res, next);
				break;
			case "schedule_rejected":
				selectConsultationRejectController(req, res, next);
				break;
			default:
				selectConsultationConfirmController(req, res, next);
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

				fulfillments: message.order.fulfillments.map(
					({ id, stops, ...each }: any) => ({
						...each,
						id,
						tracking: false,
						state: {
							descriptor: {
								code: "Serviceable",
							},
						},
						stops: stops.map((stop: any) => {
							stop.time.label = "confirmed";
							stop.tags = {
								descriptor: {
									code: "schedule",
								},
								list: [
									{
										descriptor: {
											code: "ttl",
										},
										value: "PT1H",
									},
								],
							};
							return stop;
						}),
					})
				),
				quote: quoteCreatorHealthCareService(
					message.order.items,
					providersItems?.items
				),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
			}`,
			`on_select`,
			"agri-services"
		);
	} catch (error) {
		next(error);
	}
};

const selectConsultationRejectController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message, providersItems } = req.body;
		const { locations, ...provider } = message.order.provider;

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

				fulfillments: message.order.fulfillments.map(
					({ id, stops, ...each }: any) => ({
						...each,
						id,
						tracking: false,
						state: {
							descriptor: {
								code: "Serviceable",
							},
						},
						stops: stops.map((stop: any) => {
							stop.time.label = "rejected";
							stop.tags = {
								descriptor: {
									code: "schedule",
								},
								list: [
									{
										descriptor: {
											code: "ttl",
										},
										value: "PT1H",
									},
								],
							};
							return stop;
						}),
					})
				),
				quote: quoteCreatorHealthCareService(
					message.order.items,
					providersItems?.items
				),
				error: {
					code: 90001,
					message: "Schedule not available",
				},
			},
		};
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${context.bap_uri}/on_select`,
			`on_select`,
			"agri-services"
		);
	} catch (error) {
		next(error);
	}
};
