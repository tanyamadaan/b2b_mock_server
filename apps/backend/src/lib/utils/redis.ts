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
			requestToServer: boolean; // If the request was made from outside to the server
			requestFromServer: boolean; // If the request was made from server to outside agent
			cached?: boolean; // If the request has been cached instead of sending

			npRequest?: {
				// Records the request made to NP from this server in sandbox mode
				timestamp: string;
				request: object;
			};
			npResponse?: {
				// Records the response received (ACK/NACK) to this server on the above request
				timestamp: string;
				response: object;
				ack: boolean;
			};
		};
	};
	logs: {
		[key: string]: object;
	};
};

export const redis = new Redis(redisOptions);
