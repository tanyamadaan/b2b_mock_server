import { NextFunction, Request, Response } from "express";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { searchSchema } from "./search";

export const b2bSchemaValidator =
	(
		action:
			| "search"
			| "on_search"
			| "select"
			| "on_select"
			| "init"
			| "on_init"
			| "confirm"
			| "on_confirm"
			| "status"
			| "on_status"
			| "update"
			| "on_update"
			| "track"
			| "on_track"
			| "cancel"
			| "on_cancel"
	) =>
	(req: Request, res: Response, next: NextFunction) => {
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

		switch (action) {
			case "search":
				validate = ajv.compile(searchSchema);
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
