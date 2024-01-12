import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";

export const b2bRouter = Router();
b2bRouter.use(authValidatorMiddleware)
b2bRouter.use("/bap", bapRouter);
b2bRouter.use("/bpp", bppRouter);
