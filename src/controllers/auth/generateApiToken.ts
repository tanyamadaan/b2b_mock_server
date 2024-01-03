import { Request, Response } from "express";
import { prisma } from "../../lib/utils";

export const generateApiToken = async (req: Request, res: Response) => {
	const id = (req.user as any).id;
	const { id: apiKey } = await prisma.apiKey.create({
		data: {
			createdBy: {
				connect: {
					id,
				},
			},
		},
	});
	return res.json({ apiKey });
};
