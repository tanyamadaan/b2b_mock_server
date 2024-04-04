import { Request, Response } from "express";
import { logger } from "../../../lib/utils";

export const onStatusController = (req: Request, res: Response) => {
	logger.info({
		type: "response",
		message: { sync: { message: { ack: { status: "ACK" } } } },
	});
	return res.json({
		message: {
			ack: {
				status: "ACK",
			},
		},
	});
};
