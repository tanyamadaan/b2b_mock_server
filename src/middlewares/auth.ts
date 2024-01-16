import { NextFunction, Request, Response } from "express";
import { verifyHeader } from "../lib/utils/auth";
import { Locals } from "../interfaces";

export const authValidatorMiddleware = async (
	req: Request,
	res: Response<{}, Locals>,
	next: NextFunction
) => {
	try {

		const auth_header = req.headers["authorization"] || "";
		console.log(req.body?.context?.transaction_id, "headers", auth_header);

		var verified = await verifyHeader(auth_header, req, res);
		console.log(
			req.body?.context?.transaction_id,
			"Verification status:",
			verified
		);

		if (!verified) {
			return res.status(401).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					message: "Authentication failed",
				},
			});
		}
		next();
	} catch (err) {
		next(err);
	}
};
