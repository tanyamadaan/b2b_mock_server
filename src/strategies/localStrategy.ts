import { Strategy as LocalStrategy } from "passport-local";
import * as argon2 from "argon2";
import { prisma } from "../lib/utils";
import { Prisma } from "@prisma/client";

export const localStrategy = new LocalStrategy({usernameField: "email"},async function verify(
	email: string,
	password: string,
	cb
) {
	try {
		const {password: userPass, ...user} = await prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});
		if (await argon2.verify(userPass, password)) {
			return cb(null, user);
		} else {
			return cb(null, false, { message: "Incorrect username or password." });
		}
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025")
				return cb(null, false, { message: "User does not exist" })
		}
		return cb(error);
	}
});
