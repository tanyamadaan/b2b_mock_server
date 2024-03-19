import { NextFunction, Request, Response } from "express";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { initiateTransactionSchema } from "./initiate";

export const miscSchemaValidator =
	(schema: "initiate") => (req: Request, res: Response, next: NextFunction) => {
		const ajv = new Ajv({
			allErrors: true,
			strict: false,
			strictRequired: false,
			strictTypes: false,
			$data: true,
		});
		addFormats(ajv);

		require("ajv-errors")(ajv);
		var validate: ValidateFunction<{
				[x: string]: {};
			}>,
			isValid: boolean;

		switch (schema) {
			case "initiate":
				validate = ajv.compile(initiateTransactionSchema);
				break;

			default:
				res.status(400).json({
					message: {
						ack: {
							status: "NACK",
						},
					},
					error: {
						type: "JSON-SCHEMA-ERROR",
						code: "50009",
					},
				});
				return;
		}

		isValid = validate(req.body);

		if (!isValid) {
			res.status(400).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					type: "JSON-SCHEMA-ERROR",
					code: "50009",
					message: validate.errors?.map(({ message }) => ({ message })),
				},
			});
			return;
		}
		next();
	};
