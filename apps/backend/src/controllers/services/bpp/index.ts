import { Router } from "express";
import { searchController } from "./search";

import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { cancelController } from "./cancel";

export const bppRouter = Router();

bppRouter.post("/search", searchController);

bppRouter.post("/init", initController);

bppRouter.post("/select", selectController);

bppRouter.post("/confirm", confirmController);

bppRouter.post("/update", updateController);
bppRouter.post("/status", statusController);
bppRouter.post("/cancel", cancelController);
