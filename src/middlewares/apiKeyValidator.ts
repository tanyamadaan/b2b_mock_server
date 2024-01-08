import { NextFunction, Request, Response } from "express";
import { HOUR24, RATE_LIMIT_24HR, prisma } from "../lib/utils";
import { Prisma } from "@prisma/client";

export const apiKeyValidator = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Create a URL object
	const url = new URL(req.url, `http://${req.headers.host}`);

	const apiKey = url.searchParams.get("apiKey");
	if (!apiKey) {
		return res.status(401).json({ message: "No API Key provided in URL" });
	} else {
		try {
			const { queryFreq, lastQuery } = await prisma.apiKey.findUniqueOrThrow({
				where: {
					id: apiKey,
				},
			});

			if (new Date(lastQuery!).getTime() - Date.now() < HOUR24) {
				if (queryFreq! + 1 > RATE_LIMIT_24HR) {
					return res.status(403).json({ message: "Daiy Limit Reached" });
				}
			}
			await prisma.apiKey.update({
				where: {
					id: apiKey,
				},
				data: {
					queryFreq: queryFreq! + 1,
					lastQuery: new Date(),
				},
			});
			next();
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025")
					return res
						.status(401)
						.json({ message: "Invalid API Key provided in URL" });
			}
			console.log("ERROR: During API Key Validation");
			console.log("ERROR: Route -", req.url);
			console.log("ERROR:", error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	}
};
