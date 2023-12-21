import { Request, Response } from "express";

export const searchController = (req: Request, res: Response) => {
  const context = req.body.context;
  return res.json({
    // context,
    sync: {
      message: {
        ack: {
          status: "ACK",
        },
      },
    },
    async: {
      
    }
  });
};
