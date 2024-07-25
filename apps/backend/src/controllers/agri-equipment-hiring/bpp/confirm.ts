import { NextFunction, Request, Response } from "express";
import { redisFetchFromServer, responseBuilder, send_nack, updateFulfillments } from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ORDER_STATUS } from "../../../lib/utils/apiConstants";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const confirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		confirmConsultationController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

export const confirmConsultationController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: { order },
		} = req.body;

		const on_init = await redisFetchFromServer(ON_ACTION_KEY.ON_INIT, context?.transaction_id);

		if (on_init && on_init?.error) {
			return send_nack(res, on_init?.error?.message?on_init?.error?.message:ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED)
		}

		if (!on_init) {
			return send_nack(res, ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED)
		}

		const { fulfillments } = order;
		const updatedFulfillments = updateFulfillments(
			fulfillments,
			ON_ACTION_KEY?.ON_CONFIRM
		);

		const responseMessage = {
			order: {
				...order,
				status: ORDER_STATUS.ACCEPTED,
				fulfillments: updatedFulfillments,
				provider: {
					...order.provider,
					rateable: true,
				},
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_CONFIRM : `/${ON_ACTION_KEY.ON_CONFIRM}`
			}`,
			`${ON_ACTION_KEY.ON_CONFIRM}`,
			"agri-equipment-hiring"
		);
	} catch (error) {
		next(error);
	}
};
