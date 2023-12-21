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

export const b2bBppRouter = Router();

b2bBppRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);
b2bBppRouter.post(
  "/onSearch",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

b2bBppRouter.post("/init", jsonSchemaValidator(initSchema), initController);
b2bBppRouter.post("/onInit", jsonSchemaValidator(onInitSchema), onInitController);

b2bBppRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);
b2bBppRouter.post(
  "/onSelect",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

b2bBppRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);
b2bBppRouter.post(
  "/onConfirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

b2bBppRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);
b2bBppRouter.post(
  "/onStatus",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

b2bBppRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);
b2bBppRouter.post(
  "/onUpdate",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
