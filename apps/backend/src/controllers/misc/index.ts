import { Router } from "express";
import { analyseController } from "./analyse";
import { pingController } from "./ping";

export const miscRouter = Router();

miscRouter.get("/", pingController);
miscRouter.get("/analyse/:transactionId", analyseController)