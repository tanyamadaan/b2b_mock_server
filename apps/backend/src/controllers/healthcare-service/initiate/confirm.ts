import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	checkIfCustomized,
	send_response,
	send_nack,
	logger,
	quoteCreatorServiceCustomized,
	redisFetch,
	HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL,
	quoteCreatorHealthCareService
} from "../../../lib/utils";

export const initiateConfirmController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { scenario, transactionId } = req.body;
	const on_search = await redisFetch("on_search", transactionId);
	const providersItems = on_search?.message?.catalog?.providers[0]?.items;
	// req.body.providersItems = providersItems
	const on_init = await redisFetch("on_init", transactionId)
	if (!on_init) {
		send_nack(res, "On Init doesn't exist")
	}
	on_init.context.bpp_uri = HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
	return intializeRequest(res, next, on_init, scenario, providersItems);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string,
	providersItems: any
) => {
	const {
		context,
		message: {
			order: {
				provider,
				locations,
				payments,
				fulfillments,
				xinput,
				items,
			},
		},
	} = transaction;
	const { transaction_id } = context;
	const { stops, ...remainingfulfillments } = fulfillments[0];

	const timestamp = new Date().toISOString();
	const customized = checkIfCustomized(items);
	const confirm = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "confirm",
			bap_id: MOCKSERVER_ID,
			bap_uri: HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4()
		},
		message: {
			order: {
				...transaction.message.order,
				id: uuidv4(),
				status: "Created",
				provider: {
					...provider,
					locations,
				},
				items,
				fulfillments: [
					{
						...remainingfulfillments,
						stops: stops.map((stop: any) => {
							return {
								...stop,
								contact: {
									...stop.contact,
									email: stop.contact && stop.contact.email ? stop.contact.email : "nobody@nomail.com"
								},
								customer: {
									person: {
										name: "Ramu",
									},
								},
								tags: undefined
							};
						}),
					},
				],
				quote: customized
					? quoteCreatorServiceCustomized(items)
					: quoteCreatorHealthCareService(items, providersItems),
				payments: [
					{
						...payments[0],
						params: {
							...payments[0].params,
							transaction_id: uuidv4(),
						},
						status: "PAID",
					},
				],
				created_at: timestamp,
				updated_at: timestamp,
				xinput: {
					...xinput,
					form: {
						...xinput?.form,
						submission_id: uuidv4(),
						status: "SUCCESS",
					}
				},
			},
		},
	};
	await send_response(res, next, confirm, transaction_id, "confirm", scenario = scenario);
};
