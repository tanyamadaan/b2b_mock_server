import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signin = (req: Request, res: Response) => {
	const authToken = jwt.sign(
		{ id: (req.user as any).id },
		process.env.JWT_SECRET as string
	);
	return res.json({ authToken });
};
