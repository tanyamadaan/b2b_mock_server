import { NextFunction, Request, Response } from "express";
import { getSenderDetails, verifyHeader } from "../lib/utils/auth";
import { Locals } from "../interfaces";

export const authValidatorMiddleware = async (
	req: Request,
	res: Response<{}, Locals>,
	next: NextFunction
) => {
	try {
    req.body = res.locals.rawBody ? JSON.parse(res.locals.rawBody) : null;
		console.log(`\nNew Request txn_id ${req.body?.context?.transaction_id}`);
		console.log(`Response from BPP ${JSON.stringify(req.body)}`);
		console.log("\nNew Request txn_id", req.body?.context?.transaction_id);
		if (req.body?.context?.bap_id) {
			console.log(
				req.body?.context?.transaction_id,
				"Request from",
				req.body?.context?.bpp_id
			);
		}
		const auth_header = req.headers["authorization"] || "";
		console.log(req.body?.context?.transaction_id, "headers", req.headers);

		var verified = await verifyHeader(auth_header, req, res);
		console.log(
			req.body?.context?.transaction_id,
			"Verification status:",
			verified
		);

		if (verified) {
			const senderDetails = await getSenderDetails(auth_header);
			res.locals.sender = senderDetails;
			next();
		} else {
			res.status(401).json({
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
	} catch (err) {
		next(err);
	}
};
