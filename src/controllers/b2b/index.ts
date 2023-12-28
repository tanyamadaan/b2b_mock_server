import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { apiKeyValidator } from "../../middlewares";

export const b2bRouter = Router();
b2bRouter.use(apiKeyValidator)
b2bRouter.use("/bap", bapRouter);
b2bRouter.use("/bpp", bppRouter);
