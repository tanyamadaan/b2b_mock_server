import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";

export const servicesRouter = Router();
servicesRouter.use(authValidatorMiddleware);
servicesRouter.use(rateLimiter);
servicesRouter.use("/bap", bapRouter);
servicesRouter.use("/bpp", bppRouter);
