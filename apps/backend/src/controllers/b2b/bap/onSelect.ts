import { Request, Response } from "express";
import { initDomestic, initDomesticBPPPayment, initDomesticNonRFQ, initExports } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onSelectController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'domestic':
			onSelectDomesticController(req, res)
			break;
		case 'domestic-non-rfq':
			onSelectDomesticNonRfqController(req, res)
			break;
		case 'exports':
			onSelectExportsController(req, res)
			break;
		case 'domestic-bpp-payment':
			onSelectDomesticBPPPaymentController(req, res)
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
};

export const onSelectDomesticController = (req: Request, res: Response) => {
	const {
		context,
		message: {
			order: { provider, items, payments, fulfillments },
		},
	} = req.body;
	const responseMessage = {
		order: {
			...initDomestic.message.order,
			provider,
			items,
			payments,
			fulfillments: fulfillments.map((fulfillment: any) => ({
				...initDomestic.message.order.fulfillments[0],
				id: fulfillment.id,
			})),
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bpp_uri}/${ACTIONS.init}`,
		ACTIONS.init
	);
};

export const onSelectDomesticNonRfqController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		initDomesticNonRFQ.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};

export const onSelectExportsController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		initExports.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};

export const onSelectDomesticBPPPaymentController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		initDomesticBPPPayment.message,
		req.body.context.bpp_uri,
		`${ACTIONS.init}`
	);
};
