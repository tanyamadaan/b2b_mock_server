import { NextFunction, Request, Response } from "express";

export const redisRetriever = (req: Request, res: Response, next: NextFunction) => {
  const {context: { transaction_id, message_id}} = req.body;
  
}