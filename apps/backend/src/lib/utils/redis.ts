import Redis, { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
	host: process.env.REDIS_HOST || "localhost",
	port: (process.env.REDIS_PORT || 6379) as number,
	password: process.env.REDIS_PASS,
};

export type TransactionType = {
	request: object;
	response?: object
};



export const redis = new Redis(redisOptions);
