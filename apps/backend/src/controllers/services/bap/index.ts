import { Router } from "express";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";
import { redisRetriever } from "../../../middlewares";

export const bapRouter = Router();

bapRouter.post("/on_search", redisRetriever, onSearchController);

bapRouter.post("/on_init", redisRetriever, onInitController);
bapRouter.post("/on_select", redisRetriever, onSelectController);

bapRouter.post("/on_confirm", redisRetriever, onConfirmController);

bapRouter.post("/on_status", redisRetriever, onStatusController);

bapRouter.post("/on_update", redisRetriever, onUpdateController);
