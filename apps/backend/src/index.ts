import express, { Express, Request, Response } from "express";
import YAML from "yaml";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

import { authRouter, b2bRouter } from "./controllers";
import path from "path";
import cors from "cors";
const app: Express = express();
const port = process.env.PORT || 3000;

const file = fs.readFileSync(path.join(__dirname, "./openapi/build/swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

app.use(cors())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json({ limit: "50mb" }));
app.get("/", (req: Request, res: Response) => {
	res.send("Mock Server for NP");
});

app.use("/b2b", b2bRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
