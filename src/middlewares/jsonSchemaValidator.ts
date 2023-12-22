import { NextFunction, Request, Response } from "express";

import Ajv from "ajv";
import addFormats from "ajv-formats";

export const jsonSchemaValidator =
	(JSONSchema: any) => (req: Request, res: Response, next: NextFunction) => {
		const ajv = new Ajv({
			allErrors: true,
			strict: false,
			strictRequired: false,
			strictTypes: false,
			$data: true,
		});
		addFormats(ajv);

		require("ajv-errors")(ajv);
		const validate = ajv.compile(JSONSchema);
		const isValid = validate(req.body);

		if (!isValid)
			return res.status(400).json({
				message: {
					ack: {
						status: "ACK",
					},
					body: {
						log_report: validate.errors,
					},
				},
			});
		next();
	};
