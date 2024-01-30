import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";

export const b2bRouter = Router();
b2bRouter.use(authValidatorMiddleware);
b2bRouter.use(rateLimiter);
b2bRouter.use("/bap", bapRouter);
b2bRouter.use("/bpp", bppRouter);
