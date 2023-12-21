import { Router } from "express";
import { searchController } from "./search";
import { jsonSchemaValidator } from "../../../middlewares/jsonSchemaValidator";
import {
  confirmSchema,
  initSchema,
  onConfirmSchema,
  onInitSchema,
  onSearchSchema,
  onSelectSchema,
  onStatusSchema,
  onUpdateSchema,
  searchSchema,
  selectSchema,
  statusSchema,
  updateSchema,
} from "../../../schema/b2b";
import { onSearchController } from "./onSearch";
import { initController } from "./init";
import { onInitController } from "./onInit";
import { selectController } from "./select";
import { onSelectController } from "./onSelect";
import { confirmController } from "./confirm";
import { onConfirmController } from "./onConfirm";
import { statusController } from "./status";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";
import { updateController } from "./update";

export const bapRouter = Router();

bapRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);
bapRouter.post(
  "/onSearch",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

bapRouter.post("/init", jsonSchemaValidator(initSchema), initController);
bapRouter.post("/onInit", jsonSchemaValidator(onInitSchema), onInitController);

bapRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);
bapRouter.post(
  "/onSelect",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

bapRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);
bapRouter.post(
  "/onConfirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

bapRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);
bapRouter.post(
  "/onStatus",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

bapRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);
bapRouter.post(
  "/onUpdate",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
