import { Request, Response } from "express";
import { onInitDomestic, onInitDomesticNonRFQ, onInitDomesticPaymentBPPNonRFQ, onInitDomesticSelfPickup, onInitExports, onInitRejectRFQ } from "../../../lib/examples";
import { ACTIONS, quoteCreator, responseBuilder } from "../../../lib/utils";

export const initDomesticController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const { items, fulfillments, tags, billing, ...remainingMessage } =
		message.order;
	const {type, collected_by, ...staticPaymentInfo} = onInitDomestic.message.order.payments[0];
	const responseMessage = {
		order: {
			items,
			fulfillments,
			tags,
			billing,
			provider: {id: remainingMessage.provider.id},
			provider_location: remainingMessage.provider.locations[0],
			payments: remainingMessage.payments.map((each: any) => ({...each, ...staticPaymentInfo})),
			quote: quoteCreator(items)
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/on_${ACTIONS.init}`,
		`on_${ACTIONS.init}`
	);
};

export const initController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'rfq':
			initDomesticController(req, res)
			break;
		case 'non-rfq':
			initDomesticNonRfq(req, res)
			break;
		case 'payment-bpp-non-rfq':
			initDomesticPaymentBppNonRfq(req, res)
			break;
		case 'self-pickup':
			initDomesticSelfPickup(req, res)
			break;
		case 'exports':
			initExports(req, res)
			break;
		case 'reject-rfq':
			initRejectRfq(req, res)
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

// export const initDomestic = (req: Request, res: Response) => {
// 	return responseBuilder(
// 		res,
// 		req.body.context,
// 		onInitDomestic.message,
// 		req.body.context.bap_uri,
// 		`on_${ACTIONS.init}`
// 	);
// };

export const initDomesticNonRfq = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitDomesticNonRFQ.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.init}`
	);
};

export const initDomesticPaymentBppNonRfq = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitDomesticPaymentBPPNonRFQ.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.init}`
	);
};

export const initDomesticSelfPickup = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitDomesticSelfPickup.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.init}`
	);
};

export const initExports = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitExports.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.init}`
	);
};

export const initRejectRfq = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onInitRejectRFQ.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.init}`
	);
};
