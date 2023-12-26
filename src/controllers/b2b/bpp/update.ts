import { Request, Response } from "express";
import { onUpdateFulfillments } from "../../../lib/examples";
import { onUpdatePrepaid } from "../../../lib/examples";

export const updateFulfillmentController = (req: Request, res: Response) => {
  var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_update",
		timeStamp: ts.toISOString(),
	};
  return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
		async: {
			context,
			message: onUpdateFulfillments.message,
		},
	});
};

export const updatePrepaidController = (req: Request, res: Response) => {
  var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_update",
		timeStamp: ts.toISOString(),
	};
  return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
		async: {
			context,
			message: onUpdatePrepaid.message,
		},
	});
};