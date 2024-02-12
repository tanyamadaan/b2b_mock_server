import { Request, Response } from "express";
import { onUpdateFulfillments, onUpdatePrepaid } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";


export const updateController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'fulfillment':
			updateFulfillmentController(req, res)
			break;
		case 'prepaid':
			updateFulfillmentController(req, res)
			break;
		default:
			return res.status(404).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					message: "Invalid scenario",
				},
			});
			break;
	}
}



export const updateFulfillmentController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onUpdateFulfillments.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.update}`
	);
};

export const updatePrepaidController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onUpdatePrepaid.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.update}`,
		`on_${ACTIONS.update}`
	);
};
