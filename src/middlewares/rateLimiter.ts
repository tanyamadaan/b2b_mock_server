import { NextFunction, Request, Response } from "express";
import { SubscriberDetail } from "../interfaces";
import { prisma } from "../lib/utils";
export const rateLimiter = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
  if(process.env.RATE_LIMIT_MODE) {
    const subscriberDetails: SubscriberDetail = res.locals.sender;
		const subscriber = await prisma.user.findUnique({
			where: {
				subscriber_id: subscriberDetails.subscriber_id
			}
		});
		if((new Date()).getTime() - subscriber?.lastAccessed?.getTime()! < 24 * 60 * 60 * 1000) {
			if(subscriber?.accessCount! > parseInt(process.env.RATE_LIMIT_24HR!)) {
				res.status(401).json({
					message: {
						ack: {
							status: "NACK",
						},
					},
					error: {
						message: "Rate Limit Exceeded",
					},
				});
			}
		}
  }
	next();
};
