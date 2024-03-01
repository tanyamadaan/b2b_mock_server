import { Router } from "express";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";

export const bapRouter = Router();

bapRouter.post("/on_search", onSearchController);

bapRouter.post("/on_init", onInitController);
bapRouter.post("/on_select", onSelectController);

bapRouter.post("/on_confirm", onConfirmController);

bapRouter.post("/on_status", onStatusController);

bapRouter.post("/on_update", onUpdateController);
