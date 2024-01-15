import { Request, Response, Router } from "express";
import { authValidatorMiddleware } from "../../middlewares";

export const authRouter = Router();

authRouter.post("/signCheck", authValidatorMiddleware, (req: Request, res: Response) => {
  return res.json({
    message: "Valid Signature"
  })
})