import { Request, Response, Router } from "express";
import { authValidatorMiddleware } from "../../middlewares";

export const authRouter = Router();

authRouter.post("/sigCheck", authValidatorMiddleware, (req: Request, res: Response) => {
  return res.json({
    message: "Valid Signature"
  })
})