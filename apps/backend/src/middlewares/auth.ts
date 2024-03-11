import { NextFunction, Request, Response } from "express";
import { verifyHeader } from "../lib/utils/auth";
import { Locals } from "../interfaces";

export const authValidatorMiddleware = async (
	req: Request,
	res: Response<{}, Locals>,
	next: NextFunction
) => {
	try {
		if (req.originalUrl.includes("/auth")) {
			next();
			return;
		}
		const mode = req.query.mode as string;
		// console.log("MODE", mode, ["sandbox", "mock"].includes(mode));
		if (!mode || !["sandbox", "mock"].includes(mode))
			return res.status(400).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					message: "Mode Not specified or Invalid",
				},
			});

		res.setHeader("mode", mode);

		if (mode === "mock")
			next(); //skipping auth header validation in "mock" mode
		else {
			// console.log("MODE:", mode);
			const auth_header = req.headers["authorization"] || "";
			// console.log(req.body?.context?.transaction_id, "headers", auth_header);

			var verified = await verifyHeader(auth_header, req, res);
			// console.log(
			// 	req.body?.context?.transaction_id,
			// 	"Verification status:",
			// 	verified
			// );

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
		}
	} catch (err) {
		next(err);
	}
};
