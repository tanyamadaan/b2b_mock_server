import Redis, { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
	host: process.env.REDIS_HOST || "localhost",
	port: (process.env.REDIS_PORT || 6379) as number,
	password: process.env.REDIS_PASS,
};


export type TransactionType = {
	actions: string[];
	actionStats?: {
		[key: string]: {
			npRequest?: {
				timestamp: string, 
				request: object
			}
			npResponse?: {
				timestamp: string,
				response: object,
				ack: boolean
			}
		}
	},
	logs: {
		[key: string]: object;
	};
};

export const redis = new Redis(redisOptions);
