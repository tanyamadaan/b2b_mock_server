import { Router } from "express";
import { signin } from "./signin";
import { signup } from "./signup";
import { generateApiToken } from "./generateApiToken";
import { getApiTokens } from "./getApiTokens";
import { getUserProfile } from "./getUserProfile";
export const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/generate-api-token", generateApiToken);
authRouter.get("/api-token", getApiTokens);
authRouter.get("/profile", getUserProfile);
