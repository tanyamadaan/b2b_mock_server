import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../../../lib/utils";


export const confirmController = (req: Request, res: Response, next: NextFunction) => {
	confirmConsultationController(req, res, next);
};


export const confirmConsultationController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message: { order } } = req.body;
	const { fulfillments } = order

	const rangeStart = new Date().setHours(new Date().getHours() + 2)
	const rangeEnd = new Date().setHours(new Date().getHours() + 3)

	fulfillments[0].stops.push({
		type: "start",
		location: {
			id: "L1",
			descriptor: {
				name: "ABC Store"
			},
			gps: "12.956399,77.636803"
		},
		time: {
			range: {
				start: new Date(rangeStart).toISOString(),
				end: new Date(rangeEnd).toISOString()
			}
		},
		contact: {
			phone: "9886098860",
			email: "nobody@nomail.com"
		},
		person: {
			name: "Kishan"
		}
	})

	const responseMessage = {
		order: {
			...order,
			status: 'Accepted',
			fulfillments: [{
				...fulfillments[0],
				state: {
					descriptor: {
						code: "Pending"
					}
				},
				stops: fulfillments[0].stops.map((itm: any) => ({
					...itm,
					person: itm.customer && itm.customer.person ? itm.customer.person : undefined,
				})),
				rateable: true,
			}],
			provider: {
				...order.provider,
				rateable: true
			}
		}
	}

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
		}`,
		`on_confirm`,
		"healthcare-service"
	);
};


