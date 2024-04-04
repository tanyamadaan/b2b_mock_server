import { Request, Response } from "express";

export const onUpdateController = (req: Request, res: Response) => {
	return res.json({
		message: {
			ack: {
				status: "ACK",
			},
		},
	});
};
