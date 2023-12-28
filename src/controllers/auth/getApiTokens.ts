import { Request, Response } from "express";
import { prisma } from "../../lib/utils";

export const getApiTokens = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId
    }
  });
  return res.json({apiKeys})
}