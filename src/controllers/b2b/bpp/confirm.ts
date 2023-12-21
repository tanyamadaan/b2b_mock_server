import { Request, Response } from "express";

export const confirmController = (req: Request, res: Response) => {
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
