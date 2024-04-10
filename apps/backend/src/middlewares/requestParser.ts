import { NextFunction, Request, Response } from "express";

export const requestParser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body) next();

	if (req.headers["content-type"] === "application/json") {
    (req as any).rawBody = req.body;
    req.body = JSON.parse(req.body.toString())
	}
  next();
};
