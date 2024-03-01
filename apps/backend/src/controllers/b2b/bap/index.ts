import { Router } from "express";
import { jsonSchemaValidator } from "../../../middlewares";
import {
  onConfirmSchema,
  onInitSchema,
  onSearchSchema,
  onSelectSchema,
  onStatusSchema,
  onUpdateSchema,
} from "../../../lib/schema/b2b";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";

export const bapRouter = Router();

bapRouter.post(
  "/on_search",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

bapRouter.post("/on_init", jsonSchemaValidator(onInitSchema), onInitController);
bapRouter.post(
  "/on_select",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

bapRouter.post(
  "/on_confirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

bapRouter.post(
  "/on_status",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

bapRouter.post(
  "/on_update",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
