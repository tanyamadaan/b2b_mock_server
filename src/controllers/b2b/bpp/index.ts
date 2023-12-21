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

export const bppRouter = Router();

bppRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);
bppRouter.post(
  "/onSearch",
  jsonSchemaValidator(onSearchSchema),
  onSearchController
);

bppRouter.post("/init", jsonSchemaValidator(initSchema), initController);
bppRouter.post("/onInit", jsonSchemaValidator(onInitSchema), onInitController);

bppRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);
bppRouter.post(
  "/onSelect",
  jsonSchemaValidator(onSelectSchema),
  onSelectController
);

bppRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);
bppRouter.post(
  "/onConfirm",
  jsonSchemaValidator(onConfirmSchema),
  onConfirmController
);

bppRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);
bppRouter.post(
  "/onStatus",
  jsonSchemaValidator(onStatusSchema),
  onStatusController
);

bppRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);
bppRouter.post(
  "/onUpdate",
  jsonSchemaValidator(onUpdateSchema),
  onUpdateController
);
