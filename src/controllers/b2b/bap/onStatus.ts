import { Request, Response } from "express";

export const onStatusController = (req: Request, res: Response) => {
	return res.json({
		message: {
			ack: {
				status: "ACK",
			},
		},
	});
};
