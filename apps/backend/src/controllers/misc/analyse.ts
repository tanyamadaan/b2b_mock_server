import { Request, Response } from "express";
import { TransactionType, redis } from "../../lib/utils";

export const analyseController = async (req: Request, res: Response) => {
  const transactionId = req.params["transactionId"];
  if(!transactionId) return res.status(400).json({
    message: {
      ack: {
        status: "NACK",
      },
    },
    error: {
      message: "Transaction ID not specified",
    },
  });
  const transaction = await redis.get(transactionId);
  if(!transaction) return res.status(404).json({
    message: {
      ack: {
        status: "NACK",
      },
    },
    error: {
      message: "Transaction Not Found",
    },
  });

  return res.json(JSON.parse(transaction))
}