import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { FULFILLMENT_LABELS } from "../../../lib/utils/apiConstants";

export const updateController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { scenario } = req.query;
		switch (scenario) {
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
							? { ...stop.time, label: FULFILLMENT_LABELS.CONFIRMED }
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
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_UPDATE : `/${ON_ACTION_KEY.ON_UPDATE}`
		}`,
		`${ON_ACTION_KEY.ON_UPDATE}`,
		"agri-services"
	);
};
