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

export const b2bBapRouter = Router();

b2bBapRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);
b2bBapRouter.post(
  "/onSearch",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

b2bBapRouter.post("/init", jsonSchemaValidator(initSchema), initController);
b2bBapRouter.post("/onInit", jsonSchemaValidator(onInitSchema), onInitController);

b2bBapRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);
b2bBapRouter.post(
  "/onSelect",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

b2bBapRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);
b2bBapRouter.post(
  "/onConfirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

b2bBapRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);
b2bBapRouter.post(
  "/onStatus",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

b2bBapRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);
b2bBapRouter.post(
  "/onUpdate",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
