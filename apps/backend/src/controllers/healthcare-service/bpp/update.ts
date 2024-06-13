import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { quoteCreatorHealthCareService, redisFetchToServer, responseBuilder, send_nack } from "../../../lib/utils";
import { ON_ACTTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";


export const updateController = async (req: Request, res: Response, next: NextFunction) => {
	const { scenario } = req.query;

		const on_confirm = await redisFetchToServer(ON_ACTTION_KEY.ON_CONFIRM, req.body.context.transaction_id);
		if (!on_confirm) {
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED)
		}

		const on_search = await redisFetchToServer(ON_ACTTION_KEY.ON_SEARCH, req.body.context.transaction_id);
		if (!on_search) {
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED)
		}

		const providersItems = on_search?.message?.catalog?.providers[0];
		req.body.providersItems = providersItems

		req.body.on_confirm = on_confirm


	switch (scenario) {
		case "payments":
			updatePaymentController(req, res, next);
			break;
		case "requote":
			updateRequoteController(req, res, next);
			break;
		case "reschedule":
			updateRescheduleController(req, res, next);
			break;
		case "modifyItems":
			updateRescheduleAndItemsController(req, res, next);
			break;
		default:
			updateRequoteController(req, res, next);
			break;
	}
};

//HANDLE PAYMENTS TARGET 
export const updateRequoteController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message, on_confirm } = req.body;

	//CREATED COMMON RESPONSE MESSAGE FOR ALL SCENRIO AND UPDATE ACCORDENGLY IN FUNCTIONS
	const responseMessages = {
		order: {
			id: on_confirm?.message?.order.id,
			status: "Pending",
			provider: {
				id: on_confirm?.message?.order?.provider.id
			},
			...on_confirm?.message?.order,
		}
	}
	return responseBuilder(
		res,
		next,
		context,
		responseMessages,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"healthcare-service"
	);
};


//HANDLE UPDATE PAYMENTS AFTER ITEMS UPDATE
export const updatePaymentController = (req: Request, res: Response, next: NextFunction) => {
	return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
	});
};

//HANDLE FULFILLMENT TARGET (TIME SLOT RESCHEDULE) 
export const updateRescheduleController = (req: Request, res: Response, next: NextFunction) => {
	const {
		context,
		message: { order },
	} = req.body;


	const responseMessage = {
		order: {
			...order,
			fulfillments: [
				{
					...order.fulfillments[0],
					stops: order.fulfillments[0].stops.map((stop: any) => ({
						...stop,
						time:
							stop.type === "end"
								? { ...stop.time, label: "selected" }
								: stop.time,
					})),
				},
			]
		}
	};

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"healthcare-service"
	);
};

//HANDLE FULFILLMENT TARGET (TIME SLOT RESCHEDULE,ITEMS AND PATIENTS)(MODIFY NUMBER OF PATIENTS AND NUMBER OF TEST)
export const updateRescheduleAndItemsController = (req: Request, res: Response, next: NextFunction) => {
	const {
		context,
		message: { order },
		on_confirm,
		providersItems
	} = req.body;

	//UPDATE PAYMENT OBJECT AND QUOTE ACCORDING TO ITEMS AND PERSONS
	const quote = quoteCreatorHealthCareService(order.items, providersItems?.items, providersItems?.offers)

	//UPDATE PAYMENT OBJECT ACCORDING TO QUANTITY 
	const updatedPaymentObj = updatePaymentObject(order.payments, quote?.price?.value);

	const responseMessage = {
		order: {
			...order,
			ref_order_ids: [on_confirm?.message?.order?.id],
			fulfillments: [
				{
					...order.fulfillments[0],
					stops: order.fulfillments[0].stops.map((stop: any) => ({
						...stop,
						time:
							stop.type === "end"
								? { ...stop.time, label: "selected" }
								: stop.time,
					})),
				},
			],
			payments: updatedPaymentObj,
			quote
		}
	};

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"healthcare-service"
	);
};


//UPDATE PAYMENT OBJECT FUNCTION HANDLE HERE
function updatePaymentObject(payments: any, quotePrice: any) {

	//UPDATE OBJECT WITH UNPAID AMOUNT
	const unPaidAmount = (parseFloat(quotePrice) - parseFloat(payments[0]?.params?.amount)).toString()
	payments.push({
		...payments[0],
		id: "P2",
		params: {
			...payments[0].params,
			amount: unPaidAmount,
			transaction_id: uuidv4()
		},
		status: "NOT-PAID"
	})

	return payments;
}