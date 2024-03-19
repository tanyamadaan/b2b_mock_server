import { Router } from "express";
import { analyseController } from "./analyse";
import { pingController } from "./ping";
import { initiateController } from "./initiate";
import { miscSchemaValidator } from "../../lib/schema/misc";

export const miscRouter = Router();

miscRouter.get("/", pingController);
miscRouter.post(
	"/initiate/b2b",
	miscSchemaValidator("initiate"),
	initiateController
);
miscRouter.get("/analyse/:transactionId", analyseController);
