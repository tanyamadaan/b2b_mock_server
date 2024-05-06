import express, { Express, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import {
	authRouter,
	b2bRouter,
	miscRouter,
	servicesRouter,
} from "./controllers";

import cors from "cors";
import {
	authSwagger,
	b2bSwagger,
	miscSwagger,
	requestParser,
	servicesSwagger,
} from "./middlewares";
import { logger } from "./lib/utils";
import { AxiosError } from "axios";
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/api-docs/auth", swaggerUi.serve, authSwagger("/api-docs/auth"));
app.use("/api-docs/misc", swaggerUi.serve, miscSwagger("/api-docs/misc"));
app.use("/api-docs/b2b", swaggerUi.serve, b2bSwagger("/api-docs/b2b"));
app.use(
	"/api-docs/services",
	swaggerUi.serve,
	servicesSwagger("/api-docs/services")
);

app.use(express.raw({ type: "*/*", limit: "1mb" }));
app.use(requestParser);
app.use("/", miscRouter);

app.use("/b2b", b2bRouter);
app.use("/auth", authRouter);
app.use("/services", servicesRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(`Error occured: ${err.stack}`);
	return res.status(500).send({
		message: {
			ack: {
				status: "NACK",
			},
		},
		error: {
			message: err instanceof AxiosError ? err.response : err.message,
		},
	});
});

app.use("/detect_app_installation", (req: Request, res: Response) => {
	const headers = req.headers;
	return res.json({
		headers: headers,
	});
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
