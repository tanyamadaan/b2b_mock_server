import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { confirmDomestic, confirmExports, confirmNonRFQ, selectDomesticNonRFQ } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const onInitController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'domestic':
			onInitDomesticController(req, res)
			break;
		case 'domestic-non-rfq':
			onInitDomesticNonRfqController(req, res)
			break;
		case 'exports':
			onInitExportsController(req, res)
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

export const onInitDomesticController = (req: Request, res: Response) => {
	const {
		context,
		message: {
			order: { provider, provider_location, ...order },
		},
	} = req.body;
	const timestamp = (new Date()).toISOString();
	const responseMessage = {
		order: {
			...order,
			id: uuidv4(),
			state: "Created",
			provider: {
				id: provider.id,
				locations: [
					{
						...provider_location,
					},
				],
			},
			fulfillments: order.fulfillments.map(
				({ id, type, tracking, stops }: any) => ({
					id,
					type,
					tracking,
					stops,
				})
			),
			payments: [
				{
					params: {
						...order.quote.price,
					},
					...order.payments[0],
				},
			],
			created_at: timestamp,
			updated_at: timestamp
		},
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/${ACTIONS.confirm}`,
		ACTIONS.confirm
	);
};

export const onInitDomesticNonRfqController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		confirmNonRFQ.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};

export const onInitExportsController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		confirmExports.message,
		req.body.context.bpp_uri,
		`${ACTIONS.confirm}`
	);
};
