import { Router } from "express";
import { searchController } from "./search";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { cancelController } from "./cancel";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";

export const bppRouter = Router();

bppRouter.post(
	"/search",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "search" }),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "init" }),
	redisRetriever,
	initController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "select" }),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "confirm" }),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "update" }),
	redisRetriever,
	updateController
);

bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "status" }),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/cancel",
	jsonSchemaValidator({ domain: "agri-equipment-hiring", action: "cancel" }),
	redisRetriever,
	cancelController
);
