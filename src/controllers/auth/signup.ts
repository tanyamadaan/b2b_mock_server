import { Request, Response } from "express";
import { prisma } from "../../lib/utils";
import * as argon2 from "argon2";
import { Prisma } from "@prisma/client";

export const signup = async (req: Request, res: Response) => {
	try {
		const { email, password: rawPassword, org } = req.body;
		const password = await argon2.hash(rawPassword);
		const { password: _password, ...user } = await prisma.user.create({
			data: {
				email,
				password,
				org,
			},
		});
		return res.json({ message: "New User Created Successfully", user });
	} catch (error) {
		console.log("ERROR: During User Creation -", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002")
				return res.status(409).json({ message: "User already exists" });
		}
		return res.status(500).json({ message: "Some error occurred" });
	}
};
