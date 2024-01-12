import { Request, Response } from "express";

export const onConfirmController = (req: Request, res: Response) => {
	return res.json({
		message: {
			ack: {
				status: "ACK",
			},
		},
	});
};
