import {Router} from "express";
import {initiateSearchController} from "./search";
import { initiateInitController } from "./init";
import { initiateConfirmController } from "./confirm";
export const initiateRouter = Router();
initiateRouter.post("/search", initiateSearchController);
initiateRouter.post("/init", initiateInitController);
initiateRouter.post("/confirm", initiateConfirmController);