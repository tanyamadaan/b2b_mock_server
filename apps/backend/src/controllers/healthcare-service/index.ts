import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { initiateRouter } from "./initiate";

export const healthCareServiceRouter = Router();
healthCareServiceRouter.use(authValidatorMiddleware);
healthCareServiceRouter.use(rateLimiter);
healthCareServiceRouter.use("/bap", bapRouter);
healthCareServiceRouter.use("/bpp", bppRouter);
healthCareServiceRouter.use("/initiate", initiateRouter);
