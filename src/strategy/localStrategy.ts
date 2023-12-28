import { Strategy as LocalStrategy } from "passport-local";
import * as argon2 from "argon2";
import { prisma } from "../lib/utils";

export const localStrategy = new LocalStrategy(async function verify(
	email: string,
	password: string,
	cb
) {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});
		if (await argon2.verify(user.password, password)) {
			return cb(null, user);
		} else {
			return cb(null, false, { message: "Incorrect username or password." });
		}
	} catch (error) {
		return cb(error);
	}
});
