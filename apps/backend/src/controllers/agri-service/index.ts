import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { initiateRouter } from "./initiate";

export const agriServiceRouter = Router();
agriServiceRouter.use(authValidatorMiddleware);
agriServiceRouter.use(rateLimiter);
agriServiceRouter.use("/bap", bapRouter);
agriServiceRouter.use("/bpp", bppRouter);
agriServiceRouter.use("/initiate", initiateRouter);
