import { Router } from "express";
import { signup } from "./signup";
import { generateApiToken } from "./generateApiToken";
import { getApiTokens } from "./getApiTokens";
import { getUserProfile } from "./getUserProfile";
import { jsonSchemaValidator } from "../../middlewares";
import { userSigninSchema, userSignupSchema } from "../../schema/auth";
import passport from "passport";
import { jwtStrategy, localStrategy } from "../../strategies";
import { signin } from "./signin";

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);
export const authRouter = Router();

authRouter.post(
	"/signin",
	jsonSchemaValidator(userSigninSchema),
	passport.authenticate("local", {
		session: false,
	}),
	signin
);
authRouter.post("/signup", jsonSchemaValidator(userSignupSchema), signup);
authRouter.post(
	"/api-token",
	passport.authenticate("jwt", { session: false }),
	generateApiToken
);
authRouter.get(
	"/api-token",
	passport.authenticate("jwt", { session: false }),
	getApiTokens
);
authRouter.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	getUserProfile
);
