import { Request, Response } from "express";
import { send_ack } from "../../../lib/utils";

export const onUpdateController = (req: Request, res: Response) => {
	return send_ack(res)
};
