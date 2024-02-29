import YAML from "yaml";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { NextFunction, Request, Response } from "express";

const authFile = fs.readFileSync(
	path.join(__dirname, "../../src/openapi/auth/openapi.yaml"),
	"utf8"
);
const authSwaggerDocument = YAML.parse(authFile);
export const authSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(authSwaggerDocument)(req, res, next);
	};

const servicesFile = fs.readFileSync(
	path.join(__dirname, "../../src/openapi/services/build/swagger.yaml"),
	"utf8"
);
const servicesSwaggerDocument = YAML.parse(servicesFile);
export const servicesSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(servicesSwaggerDocument)(req, res, next);
	};

const b2bFile = fs.readFileSync(
	path.join(__dirname, "../../src/openapi/retail-b2b/build/swagger.yaml"),
	"utf8"
);
const b2bSwaggerDocument = YAML.parse(b2bFile);
export const b2bSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(b2bSwaggerDocument)(req, res, next);
	};
