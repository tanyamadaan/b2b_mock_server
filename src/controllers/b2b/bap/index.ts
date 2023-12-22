import { Router } from "express";
import { jsonSchemaValidator } from "../../../middlewares/jsonSchemaValidator";
import {
  onConfirmSchema,
  onInitSchema,
  onSearchSchema,
  onSelectSchema,
  onStatusSchema,
  onUpdateSchema,
} from "../../../schema/b2b";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";

export const bapRouter = Router();

bapRouter.post(
  "/onSearch",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

bapRouter.post("/onInit", jsonSchemaValidator(onInitSchema), onInitController);
bapRouter.post(
  "/onSelect",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

bapRouter.post(
  "/onConfirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

bapRouter.post(
  "/onStatus",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

bapRouter.post(
  "/onUpdate",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
