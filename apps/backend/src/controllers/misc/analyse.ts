import { Request, Response } from "express";
import { redis } from "../../lib/utils";
import { ACTIONS } from "openapi-specs/constants";

export const analyseController = async (req: Request, res: Response) => {
	const transactionId = req.params["transactionId"];
	if (!transactionId)
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "Transaction ID not specified",
			},
		});
	const transactionKeys = await redis.keys(`${transactionId}-*`);
	if (transactionKeys.length === 0) return res.json({});
	var transactions = await redis.mget(
		transactionKeys.filter((e) => e.endsWith("-from-server"))
	);
	const from_server = transactions.map((each) =>
		each ? JSON.parse(each) : {}
	);
	var transactions = await redis.mget(
		transactionKeys.filter((e) => e.endsWith("-to-server"))
	);
	const to_server = transactions.map((each) => (each ? JSON.parse(each) : {}));
	return res.json({ from_server, to_server });
};
