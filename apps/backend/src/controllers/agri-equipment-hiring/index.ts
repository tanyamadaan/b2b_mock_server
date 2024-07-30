import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { initiateRouter } from "./initiate";

export const agriEquipmentHiriingRouter = Router();
agriEquipmentHiriingRouter.use(authValidatorMiddleware);
agriEquipmentHiriingRouter.use(rateLimiter);
agriEquipmentHiriingRouter.use("/bap", bapRouter);
agriEquipmentHiriingRouter.use("/bpp", bppRouter);
agriEquipmentHiriingRouter.use("/initiate", initiateRouter);
