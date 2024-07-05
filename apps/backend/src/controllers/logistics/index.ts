import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
//import { initiateRouter } from "./initiate";

export const logisticsRouter = Router();
logisticsRouter.use(authValidatorMiddleware);
logisticsRouter.use(rateLimiter);
logisticsRouter.use("/bap", bapRouter);
logisticsRouter.use("/bpp", bppRouter);
//logisticsRouter.use("/initiate", initiateRouter)