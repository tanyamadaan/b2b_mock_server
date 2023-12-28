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

		if (!isValid) {
			if (req.baseUrl === "/api/b2b") {
				return res.status(400).json({
					message: {
						ack: {
							status: "NACK",
						},
						body: {
							log_report: validate.errors,
						},
					},
				});
			} else {
				return res
					.status(400)
					.json({ errors: validate.errors?.map(({ message }) => ({message})) });
			}
		}
		next();
	};
