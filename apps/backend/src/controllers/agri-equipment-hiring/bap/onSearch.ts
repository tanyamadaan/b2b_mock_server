import { NextFunction, Request, Response } from "express";
import { checkIfCustomized, responseBuilder } from "../../../lib/utils";
export const onSearchController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		onSearchSelectionController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

const onSearchSelectionController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context, message } = req.body;
		const { fulfillments, payments, providers } = message.catalog;
		const { id, locations, ...remainingProviders } = providers[0];

		// const file = fs.readFileSync(
		// 	path.join(SERVICES_EXAMPLES_PATH, "select/select_consultation_reschedule.yaml")
		// );
		// const response = YAML.parse(file.toString());
		const resposneMessage = {
			// order: {
			// 	provider: {
			// 		id,
			// 		locations: [{
			// 			id: locations[0]?.id
			// 		}],
			// 	},
			// 	items: [providers[0]?.items.map(({ id, parent_item_id, location_ids }:
			// 		{ id: any, parent_item_id: any, location_ids: any }) => ({ id, parent_item_id, location_ids: [{ id: location_ids[0] }] }))[0]],
			// 	fulfillments: [
			// 		{
			// 			type: fulfillments[0].type,
			// 			stops: [
			// 				{
			// 					"type": "end",
			// 					"location":
			// 					{
			// 						"gps": "12.974002,77.613458",
			// 						"area_code": "560001"
			// 					},
			// 					"time": {
			// 						"label": "selected",
			// 						"range": { // should be dynamic on the basis of scehdule
			// 							"start": providers[0].time.schedule.times[0],
			// 							"end": providers[0].time.schedule.times[1]
			// 						}
			// 					}
			// 				}
			// 			]
			// 		}
			// 	],
			// 	payments: [{ type: payments[0].type }]
			// }
		};

		return responseBuilder(
			res,
			next,
			context,
			resposneMessage,
			`${context.bpp_uri}${
				context.bpp_uri.endsWith("/") ? "select" : "/select"
			}`,
			`select`,
			"services"
		);
	} catch (error) {
		return next(error);
	}
};

const onSearchServiceCustomizationController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// const { context, message: { catalog: { providers, fulfillments, payments } } } = req.body;
		// const { id, locations, items, categories, ...remainingProviders } = providers[0]
		// const { id: parent_item_id, location_ids, ...item } = items[0]
		// // const file = fs.readFileSync(
		// // 	path.join(SERVICES_EXAMPLES_PATH, "select/select_service_customization.yaml")
		// // );
		// // const response = YAML.parse(file.toString());
		// const responseMessage = {
		// 	order: {
		// 		provider: {
		// 			id,
		// 			locations: [{
		// 				id: locations[0]?.id
		// 			}],
		// 		},
		// 		fulfillments: [
		// 			{
		// 				type: fulfillments[0].type,
		// 				stops: [
		// 					{
		// 						"type": "end",
		// 						"location":
		// 						{
		// 							"gps": "12.974002,77.613458",
		// 							"area_code": "560001"
		// 						},
		// 						"time": {
		// 							"label": "selected",
		// 							"range": { // should be dynamic on the basis of scehdule
		// 								// "start": providers[0].time.schedule.times[0],
		// 								// "end": providers[0].time.schedule.times[1]
		// 							}
		// 						},
		// 						"days": fulfillments[0].days?.split(',')[0] // will be from onsearch
		// 					}
		// 				]
		// 			}
		// 		],
		// 		payments: [{ type: payments[0].type }],
		// 		items: [
		// 			{ parent_item_id, location_ids },
		// 			...items.slice(1).map((item: any) => {
		// 				return {
		// 					id: item.id,
		// 					parent_item_id,
		// 					quantity: {
		// 						"selected": {
		// 							"count": 3
		// 						}
		// 					},
		// 					category_ids: item.category_ids,
		// 					tags: item.tags
		// 				}
		// 			})
		// 		]
		// 	}
		// }
		// return responseBuilder(
		// 	res,
		// 	context,
		// 	responseMessage,
		// 	`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "select" : "/select"}`,
		// 	`select`,
		// 	"services"
		// );
	} catch (error) {
		return next(error);
	}
};
