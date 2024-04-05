import { Router } from "express";
import { initiateSearchController } from "./search";

export const initiateRouter = Router();

initiateRouter.post("/search", initiateSearchController)