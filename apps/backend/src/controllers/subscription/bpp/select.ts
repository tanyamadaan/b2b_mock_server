import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	responseBuilder,
	quoteCreatorHealthCareService,
	redisFetchFromServer,
	send_nack,
	checkSelectedItems,
	updateFulfillments,
	checkIfCustomized,
	quoteCreatorServiceCustomized,
	Time,
	redis,
	quoteCreatorService,
	SUBSCRIPTION_EXAMPLES_PATH,
	quoteSubscription,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { SERVICES_DOMAINS } from "../../../lib/utils/apiConstants";
import { calculateQuotePrice } from "../../../lib/utils/getISODuration";

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
			//SERVICES AND AGRI SCENARIOS
			case "schedule_rejected":
				selectConsultationRejectController(req, res, next);
				break;

			//HEALTHCARE
			case "multi_collection":
				selectMultiCollectionController(req, res, next);
				break;

			//EQUIPMENT HIRING SCENARIOS
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
		// Example Usage
		// const duration = "P6W"; // 6 months
		// const frequency = "P1W"; // 1 month
		// const itemPrice = 199; // Price per delivery

		// const quotePrice = calculateQuotePrice(duration, frequency, itemPrice);
		// console.log(`Quote Price: ${quotePrice} INR`); // Output: Quote Price: 1194 INR

		const { context, message, providersItems } = req.body;
		const { locations, ...provider } = message.order.provider;
		const file = fs.readFileSync(
			path.join(SUBSCRIPTION_EXAMPLES_PATH, "on_select/on_select.yaml")
		);

		const response = YAML.parse(file.toString());
		const updatedFulfillments = updateFulfillments(
			message?.order?.fulfillments,
			ON_ACTION_KEY?.ON_SELECT,
			"",
			"subscription"
		);

		const responseMessage = {
			order: {
				provider,
				payments: message?.order?.payments,
				items: message.order.items.map(
					({ ...remaining }: { location_ids: any; remaining: any }) => ({
						...remaining,
					})
				),

				fulfillments: updatedFulfillments,

				quote: quoteSubscription(
					message?.order?.items,
					providersItems?.items,
					"",
					message?.order?.fulfillments[0],
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
			"subscription"
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
			"subscription",
			error
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
		console.log("multicollection");
		const { context, message, providersItems } = req.body;
		const updatedFulfillments = updateFulfillments(
			req.body?.message?.order?.fulfillments,
			ON_ACTION_KEY?.ON_SELECT,
			"multi_collection"
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
			"subscription"
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

		const domain = context?.domain;
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

				quote:
					domain === SERVICES_DOMAINS.SERVICES
						? quoteCreatorService(message?.order?.items, providersItems?.items)
						: quoteCreatorHealthCareService(
								message?.order?.items,
								providersItems?.items,
								"",
								message?.order?.fulfillments[0]?.type
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
			"subscription"
		);
	} catch (error) {
		next(error);
	}
};

const selectServiceCustomizationConfirmedController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message } = req.body;
		const { locations, ...provider } = message.order.provider;
		const { id, parent_item_id, location_ids, quantity, ...item } =
			message?.order?.items[0];
		const transactionKeys = await redis.keys(`${context.transaction_id}-*`);
		const ifTransactionToExist = transactionKeys.filter((e) =>
			e.includes("on_search-to-server")
		);

		const ifTransactionFromExist = transactionKeys.filter((e) =>
			e.includes("on_search-from-server")
		);

		const raw = await redis.mget(
			ifTransactionToExist ? ifTransactionToExist : ifTransactionFromExist
		);
		const onSearchHistory = raw.map((ele) => {
			return JSON.parse(ele as string);
		})[0].request;

		const fulfillment = message?.order?.fulfillments[0];

		const fulfillment_id =
			onSearchHistory.message?.catalog?.fulfillments.filter(
				(e: { type: string }) => e.type === fulfillment?.type
			)[0]?.id;

		const responseMessage = {
			order: {
				provider,
				payments: message?.order?.payments?.map(
					({ type }: { type: string }) => ({
						type,
						collected_by: "BAP",
					})
				),
				items: [
					{
						id,
						parent_item_id,
						location_ids,
						quantity,
						fulfillment_ids: [uuidv4()],
					},
					...message?.order?.items
						?.slice(1)
						.map(
							({
								location_ids,
								...remaining
							}: {
								location_ids: string[];
								remaining: any;
							}) => ({
								...remaining,
								location_ids,
								fulfillment_ids: [uuidv4()],
							})
						),
				],
				fulfillments:
					// message.order.fulfillments.map(
					// 	({ stops, type, ...each }: any) => ({
					// 		id: fulfillment_id,
					// 		type,
					// 		tracking: false,
					// 		state: {
					// 			descriptor: {
					// 				code: "Serviceable",
					// 			},
					// 		},
					// 		stops,
					// 	})
					// )
					[
						{
							...fulfillment,
							id: fulfillment_id,
							tracking: false,
							state: {
								descriptor: {
									code: "Serviceable",
								},
							},
							stops: fulfillment?.stops?.map((e: { time: Time }) => ({
								...e,
								time: { ...e.time, label: "confirmed" },
							})),
						},
					],
				quote: quoteCreatorServiceCustomized(
					message.order.items,
					req.body?.providersItems
				),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${context.bap_uri}/on_select`,
			`on_select`,
			"subscription"
		);
	} catch (error) {
		return next(error);
	}
};
