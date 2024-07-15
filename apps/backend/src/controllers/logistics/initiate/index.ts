import {Router} from "express";
import {initiateSearchController} from "./search";
import { initiateInitController } from "./init";
export const initiateRouter = Router();
initiateRouter.post("/search", initiateSearchController);
initiateRouter.post("/init", initiateInitController);