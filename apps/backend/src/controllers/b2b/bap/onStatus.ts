import { Request, Response } from "express";
import logger from "../../../lib/utils/logger";

export const onStatusController = (req: Request, res: Response) => {
	logger.info({ sync: { message: { ack: { status: "ACK", } } } })
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
