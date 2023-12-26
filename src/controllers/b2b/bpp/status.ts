import { Request, Response } from "express";
import { onStatusDelivered } from "../../../lib/examples";
import { onStatusOutForDelivery } from "../../../lib/examples";
import { onStatusPickedUp } from "../../../lib/examples";
import { onStatusProformaInvoice } from "../../../lib/examples";

export const statusDeliveredController = (req: Request, res: Response) => {
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_status",
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
			message: onStatusDelivered.message,
		},
	});
};

export const statusOutForDeliveryController = (req: Request, res: Response) => {
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_status",
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
			message: onStatusOutForDelivery.message,
		},
	});
};

export const statusPickedUpController = (req: Request, res: Response) => {
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_status",
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
			message: onStatusPickedUp.message,
		},
	});
};

export const statusProformaInvoiceController = (req: Request, res: Response) => {
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
  const context = {
		...req.body.context,
		action: "on_status",
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
			message: onStatusProformaInvoice.message,
		},
	});
};