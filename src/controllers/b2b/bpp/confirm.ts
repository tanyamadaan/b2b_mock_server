import { Request, Response } from "express";
import { onConfirmDomestic } from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const confirmController = (req: Request, res: Response) => {
	const { context, message } = req.body;
	const start = new Date(message.order.created_at);
	start.setHours(start.getHours() + 1);
	const end = new Date(message.order.created_at);
	end.setHours(end.getHours() + 2);

	const responseMessage = {
		...message,
		state: "Accepted",
		provider: {
			...message.provider,
			rateable: true,
		},
		fulfillments: message.fulfillments.map((eachFulfillment: any) => ({
			...eachFulfillment,
			"@ondc/org/provider_name":
				onConfirmDomestic.message.order.fulfillments[0][
					"@ondc/org/provider_name"
				],
			state: onConfirmDomestic.message.order.fulfillments[0].state,
			stops: [
				...eachFulfillment.stops,
				{
					...onConfirmDomestic.message.order.fulfillments[0].stops[0],
					time: {
						range: {
							start: start.toISOString(),
							end: end.toISOString(),
						},
					},
				},
			],
		})),
	};
	return responseBuilder(
		res,
		context,
		responseMessage,
		`${context.bap_uri}/on_${ACTIONS.confirm}`,
		`on_${ACTIONS.confirm}`
	);
};
