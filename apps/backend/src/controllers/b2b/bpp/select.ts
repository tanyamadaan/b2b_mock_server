import { Request, Response } from "express";
import { onSelectDomestic, onSelectDomesticNonRFQ, onSelectDomesticSelfPickup, onSelectExports, onSelectNonServiceable, onSelectQuantityUnavailable } from "../../../lib/examples";
import { ACTIONS, quoteCreator, responseBuilder } from "../../../lib/utils";

export const selectController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'rfq':
			selectDomesticController(req, res)
			break;
		case 'non-rfq':
			selectDomesticNonRfqController(req, res)
			break;
		case 'self-pickup':
			selectDomesticSelfPickupController(req, res)
			break;
		case 'exports':
			selectExportsController(req, res)
			break;
		case 'non-serviceable':
			selectNonServiceableController(req, res)
			break;
		case 'quantity-unavailable':
			selectQuantityUnavailableController(req, res)
			break;
		default:
			res.status(404).json({
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

export const selectDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { ttl, ...provider } = message.order.provider;


	var responseMessage = {
		order: {
			provider,
			payments: message.order.payments.map(({ type }: { type: string }) => ({
				type,
				collected_by: "BPP",
			})),
			items: message.order.items.map(
				({
					location_ids,
					...remaining
				}: {
					location_ids: any;
					remaining: any;
				}) => ({
					remaining,
				})
			),
			fulfillments: message.order.fulfillments,
			quote: quoteCreator(message.order.items)
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/on_${ACTIONS.select}`,
		`on_${ACTIONS.select}`
	);
};

export const selectDomesticNonRfqController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectDomesticNonRFQ.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};

// export const selectDomesticController = (req: Request, res: Response) => {
// 	return responseBuilder(
// 		res,
// 		req.body.context,
// 		onSelectDomestic.message,
// 		req.body.context.bap_uri,
// 		`on_${ACTIONS.select}`
// 	);
// };

export const selectDomesticSelfPickupController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectDomesticSelfPickup.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};

export const selectExportsController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectExports.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};

export const selectNonServiceableController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectNonServiceable.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};

export const selectQuantityUnavailableController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onSelectQuantityUnavailable.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.select}`
	);
};
