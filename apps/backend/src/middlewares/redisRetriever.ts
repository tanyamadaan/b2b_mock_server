import { NextFunction, Request, Response } from "express";
import { TransactionType, logger, redis } from "../lib/utils";

export const redisRetriever = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.headers["mode"] === "mock") {
		next();
		return;
	}
	const {
		context: { transaction_id, action },
	} = req.body;
	const transaction = await redis.get(`${transaction_id}-${action}-to-server`);
	// let logs: TransactionType;
	// logger.info("---------------------------------")
	// logger.info("TIME:", Date.now())
	// logger.info("FOR ACTION:", action)
	// logger.info("PICKED FROM REDIS", transaction)
	// logger.info("---------------------------------")

	let logs: TransactionType;
	if (!transaction) {
		logs = {
			request: req.body
		};
		await redis.set(`${transaction_id}-${action}-to-server`, JSON.stringify(logs));

		// next();
		// return;
	} else {
		logs = JSON.parse(transaction);
	}

	res.locals.logs = logs;
	next();
};
