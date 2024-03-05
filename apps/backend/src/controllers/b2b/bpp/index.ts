import { Router } from "express";
import { searchController } from "./search";

import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { jsonSchemaValidator } from "../../../middlewares";

export const bppRouter = Router();

bppRouter.post(
	"/search",
	jsonSchemaValidator({ domain: "b2b", action: "search" }),
	searchController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "b2b", action: "init" }),
	initController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "b2b", action: "select" }),
	selectController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "b2b", action: "confirm" }),
	confirmController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "b2b", action: "update" }),
	updateController
);
bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "b2b", action: "status" }),
	statusController
);
