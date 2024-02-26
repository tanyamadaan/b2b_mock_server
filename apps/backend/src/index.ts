import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import {
	authRouter,
	authSwagger,
	b2bRouter,
	b2bSwagger,
	servicesRouter,
	servicesSwagger,
} from "./controllers";

import cors from "cors";
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/api-docs/auth", swaggerUi.serve, authSwagger);
app.use("/api-docs/b2b", swaggerUi.serve, b2bSwagger);
app.use("/api-docs/services", swaggerUi.serve, servicesSwagger);

app.use(express.json({ limit: "50mb" }));
app.get("/", (req: Request, res: Response) => {
	res.send("Mock Server for NP");
});

app.use("/b2b", b2bRouter);
app.use("/auth", authRouter);
app.use("/services", servicesRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
