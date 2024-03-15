import YAML from "yaml";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { NextFunction, Request, Response } from "express";

import swaggerAuthSpec from "openapi-specs/auth.json";
import swaggerRetailB2BSpec from "openapi-specs/retail-b2b.json";
import swaggerServicesSpec from "openapi-specs/services.json";


export const authSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerAuthSpec)(req, res, next);
	};

export const servicesSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerServicesSpec)(req, res, next);
	};


export const b2bSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerRetailB2BSpec)(req, res, next);
	};
