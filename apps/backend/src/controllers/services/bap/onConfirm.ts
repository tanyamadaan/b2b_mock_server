import { Request, Response } from "express";

export const onConfirmController = (req: Request, res: Response) => {
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
