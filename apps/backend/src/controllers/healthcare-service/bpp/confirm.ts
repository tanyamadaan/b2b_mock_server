import { NextFunction, Request, Response } from "express";
import { responseBuilder, updateFulfillments } from "../../../lib/utils";
import { ON_ACTTION_KEY } from "../../../lib/utils/actionOnActionKeys";

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

export const confirmConsultationController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: { order },
		} = req.body;

		const { fulfillments } = order;
		const updatedFulfillments = updateFulfillments(
			fulfillments,
			ON_ACTTION_KEY?.ON_CONFIRM
		);

		console.log("updatedFulfillmentsssssssssss",updatedFulfillments)
		// fulfillments[0].stops.push({
		// 	type: "start",
		// 	location: {
		// 		id: "L1",
		// 		descriptor: {
		// 			name: "ABC Store"
		// 		},
		// 		gps: "12.956399,77.636803"
		// 	},
		// 	time: {
		// 		range: {
		// 			start: new Date(rangeStart).toISOString(),
		// 			end: new Date(rangeEnd).toISOString()
		// 		}
		// 	},
		// 	contact: {
		// 		phone: "9886098860",
		// 		email: "nobody@nomail.com"
		// 	},
		// 	person: {
		// 		name: "Kishan"
		// 	}
		// })

		const responseMessage = {
			order: {
				...order,
				status: "Accepted",
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
				req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
			}`,
			`on_confirm`,
			"healthcare-service"
		);
	} catch (error) {
		next(error);
	}
};
