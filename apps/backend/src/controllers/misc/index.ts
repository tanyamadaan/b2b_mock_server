import { Router } from "express";
import { analyseController } from "./analyse";
import { pingController } from "./ping";
import { initiateB2bController, initiateServicesController } from "./initiate";
import { miscSchemaValidator } from "../../lib/schema/misc";
import { getAllTransactionIdController } from "./getAllTransactionId";
import { getAllScenarios } from "./getAllScenarios";
import { proxy } from "./proxy";

export const miscRouter = Router();

miscRouter.get("/", pingController);
miscRouter.post(
	"/initiate/b2b",
	miscSchemaValidator("initiate/b2b"),
	initiateB2bController
);
miscRouter.post(
	"/initiate/services",
	miscSchemaValidator("initiate/services"),
	initiateServicesController
);
miscRouter.get("/scan", getAllTransactionIdController);
miscRouter.get("/analyse/:transactionId", analyseController);
miscRouter.get("/scenario/:domain/:action", getAllScenarios);
miscRouter.post("/proxy", proxy)
