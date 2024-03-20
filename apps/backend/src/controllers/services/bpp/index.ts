import { Router } from "express";
import { searchController } from "./search";

import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { cancelController } from "./cancel";
import { redisRetriever } from "../../../middlewares";

export const bppRouter = Router();

bppRouter.post("/search", redisRetriever, searchController);

bppRouter.post("/init", redisRetriever, initController);

bppRouter.post("/select", redisRetriever, selectController);

bppRouter.post("/confirm", redisRetriever, confirmController);

bppRouter.post("/update", redisRetriever, updateController);
bppRouter.post("/status", redisRetriever, statusController);
bppRouter.post("/cancel", redisRetriever, cancelController);
