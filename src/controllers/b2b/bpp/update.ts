import { Request, Response } from "express";

export const updateController = (req: Request, res: Response) => {
  const context = req.body.context;
  return res.json({
    context,
    message: {
      ack: {
        status: "ACK",
      },
    },
  });
};
