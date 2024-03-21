import { Request, Response } from "express";
import { redis } from "../../lib/utils";

export const analyseController = async (req: Request, res: Response) => {
	var to_server: object = {},
		from_server: object = {};
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
	if (transactionKeys.filter((e) => e.endsWith("-from-server")).length > 0) {
		var transactions = await redis.mget(
			transactionKeys.filter((e) => e.endsWith("-from-server"))
		);
		from_server = transactions.map((each) => (each ? JSON.parse(each) : {}));
	}
	if (transactionKeys.filter((e) => e.endsWith("-to-server")).length > 0) {
		var transactions = await redis.mget(
			transactionKeys.filter((e) => e.endsWith("-to-server"))
		);
		to_server = transactions.map((each) => (each ? JSON.parse(each) : {}));
	}
	return res.json({ from_server, to_server });
};
