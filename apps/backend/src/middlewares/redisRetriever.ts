import { NextFunction, Request, Response } from "express";
import { TransactionType, redis } from "../lib/utils";

export const redisRetriever = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		context: { transaction_id, action },
	} = req.body;
	const transaction = await redis.get(transaction_id);

	if (!transaction) {
		await redis.set(
			transaction_id,
			JSON.stringify({ actions: [action], logs: { [action]: req.body } })
		);
		// next();
		// return;
	}
	const logs: TransactionType = transaction
		? JSON.parse(transaction)
		: { actions: [action], logs: { [action]: req.body } };
	res.locals.logs = logs;
	next();
};
