import { Request, Response } from "express";
import { prisma } from "../../lib/utils";

export const getUserProfile = async (req: Request, res: Response) => {
  console.log("Req user", req.user)
  const {password, ...user} = await prisma.user.findUniqueOrThrow({
    where: {
      id: (req.user as any).id
    },
    include: {
      apiKeys: true
    }
  })
  return res.json({user})
}