import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../../../lib/utils";

export const updateController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { scenario } = req.query;
		switch (scenario) {
			case "requote":
				updateRequoteController(req, res, next);
				break;
			case "reschedule":
				updateRescheduleController(req, res, next);
				break;
			default:
				updateRequoteController(req, res, next);
				break;
		}
	}catch(error){
		return next(error)
	}
};

export const updateRequoteController = (req: Request, res: Response, next: NextFunction) => {
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

export const updateRescheduleController = (req: Request, res: Response, next: NextFunction) => {
	const {
		context,
		message: { order },
	} = req.body;

	const responseMessage = {
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
		],
	};

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
		}`,
		`on_update`,
		"agri-services"
	);
};
