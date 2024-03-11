import Redis, { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
	host: process.env.REDIS_HOST || "localhost",
	port: (process.env.REDIS_PORT || 6379) as number,
	password: process.env.REDIS_PASS,
};

export type TransactionType = {
	actions: string[];
	logs: {
		[key in
			| "search"
			| "on_search"
			| "select"
			| "on_select"
			| "init"
			| "on_init"
			| "confirm"
			| "on_confirm"
			| "status"
			| "on_status"
			| "update"
			| "on_update"
			| "track"
			| "on_track"
			| "cancel"
			| "on_cancel"]: object;
	};
};

export const redis = new Redis(redisOptions);
