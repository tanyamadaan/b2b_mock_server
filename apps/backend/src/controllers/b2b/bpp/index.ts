import { Router } from "express";
import { searchController } from "./search";
import { jsonSchemaValidator } from "../../../middlewares/jsonSchemaValidator";
import {
  confirmSchema,
  initSchema,
  onStatusSchema,
  onUpdateSchema,
  searchSchema,
  selectSchema,
  statusSchema,
  updateSchema,
} from "../../../lib/schema/b2b";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import {
  statusDeliveredController,
  statusOutForDeliveryController,
  statusPickedUpController,
  statusProformaInvoiceController,
  statusController
} from "./status";
import {
  updateFulfillmentController,
  updatePrepaidController, updateController
} from "./update";

export const bppRouter = Router();

bppRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);


bppRouter.post("/init", jsonSchemaValidator(initSchema), initController);

bppRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);

bppRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);

bppRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);
bppRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);
