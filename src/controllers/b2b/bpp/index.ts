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
import { statusController } from "./status";
import { updateController } from "./update";

export const bppRouter = Router();

bppRouter.post("/search", jsonSchemaValidator(searchSchema), searchController);


bppRouter.post("/init", jsonSchemaValidator(initSchema), initController);

bppRouter.post("/select", jsonSchemaValidator(selectSchema), selectController);


bppRouter.post(
  "/confirm",
  jsonSchemaValidator(confirmSchema),
  confirmController
);

bppRouter.post("/status", jsonSchemaValidator(statusSchema), statusController);


bppRouter.post("/update", jsonSchemaValidator(updateSchema), updateController);

