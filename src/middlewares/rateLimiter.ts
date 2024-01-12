import { NextFunction, Request, Response } from "express";
export const rateLimiter = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
  if(process.env.RATE_LIMIT_MODE) {
    
  }
	next();
};
