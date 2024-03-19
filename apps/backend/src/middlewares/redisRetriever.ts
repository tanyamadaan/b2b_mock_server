import { NextFunction, Request, Response } from "express";
import { TransactionType, redis } from "../lib/utils";

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
	const transaction = await redis.get(transaction_id);
	let logs: TransactionType;

	if (!transaction) {
		logs = {
			actions: [action],
			actionStats: {
				[action]: { requestToServer: true, requestFromServer: false },
			},
			logs: { [action]: req.body },
		};
		await redis.set(transaction_id, JSON.stringify(logs));
		// next();
		// return;
	} else {
		logs = JSON.parse(transaction);
		if (!logs.actions.includes(action)) {
			logs.actions.push(action);
		}
		logs.logs = {
			...logs.logs,
			[action]: req.body,
		};
		logs.actionStats = {
			...logs.actionStats,
			[action]: { requestToServer: true, requestFromServer: false },
		};
	}

	res.locals.logs = logs;
	next();
};
