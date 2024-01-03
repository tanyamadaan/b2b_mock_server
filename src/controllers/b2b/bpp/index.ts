import { Router } from "express";
import { searchController } from "./search";
import { jsonSchemaValidator } from "../../../middlewares/jsonSchemaValidator";
import {
  confirmSchema,
  initSchema,
  searchSchema,
  selectSchema,
  statusSchema,
  updateSchema,
} from "../../../schema/b2b";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import {
  statusDeliveredController,
  statusOutForDeliveryController,
  statusPickedUpController,
  statusProformaInvoiceController } from "./status";
import { updateFulfillmentController,
  updatePrepaidController } from "./update";

export const bppRouter = Router();

bppRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);


bppRouter.post("/init", jsonSchemaValidator(initSchema), initController);

bppRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);


bppRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);

bppRouter.post("/status-delivered", jsonSchemaValidator(statusSchema), statusDeliveredController);
bppRouter.post("/status-out-for-delivery", jsonSchemaValidator(statusSchema), statusOutForDeliveryController);
bppRouter.post("/status-picked-up", jsonSchemaValidator(statusSchema), statusPickedUpController);
bppRouter.post("/status-proforma-invoice", jsonSchemaValidator(statusSchema), statusProformaInvoiceController);

bppRouter.post("/update-fulfillment", jsonSchemaValidator(updateSchema), updateFulfillmentController);
bppRouter.post("/update-prepaid", jsonSchemaValidator(updateSchema), updatePrepaidController);
