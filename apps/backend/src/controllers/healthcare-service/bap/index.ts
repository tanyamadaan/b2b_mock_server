import { Router } from "express";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";
import { onCancelController } from "./onCancel";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";

export const bapRouter = Router();

bapRouter.post(
	"/on_search",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_search" }),
	redisRetriever,
	onSearchController
);

bapRouter.post(
	"/on_init",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_init" }),
	redisRetriever,
	onInitController
);

bapRouter.post(
	"/on_select",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_select" }),
	redisRetriever,
	onSelectController
);

bapRouter.post(
	"/on_confirm",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_confirm" }),
	redisRetriever,
	onConfirmController
);

bapRouter.post(
	"/on_status",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_status" }),
	redisRetriever,
	onStatusController
);

bapRouter.post(
	"/on_update",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_update" }),
	redisRetriever,
	onUpdateController
);

bapRouter.post(
	"/on_cancel",
	jsonSchemaValidator({ domain: "healthcare-service", action: "on_cancel" }),
	redisRetriever,
	onCancelController
);