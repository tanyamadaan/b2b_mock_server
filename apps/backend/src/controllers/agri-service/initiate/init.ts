
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	checkIfCustomized,
	send_response,
	send_nack,
	redisFetch,
	AGRI_SERVICES_BPP_MOCKSERVER_URL,
	AGRI_SERVICES_BAP_MOCKSERVER_URL
} from "../../../lib/utils";

export const initiateInitController = async (req: Request, res: Response, next: NextFunction) => {
	const { scenario, transactionId } = req.body;
	const on_select = await redisFetch("on_select", transactionId)


	if (Object.keys(on_select).includes("error")) {
		send_nack(res,"On Select had errors")
	}
	
	if (!on_select) {
		send_nack(res,"On Select doesn't exist")
	}
	on_select.context.bpp_uri = AGRI_SERVICES_BPP_MOCKSERVER_URL

	return intializeRequest(res, next, on_select, scenario);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string
) => {
	const {
		context,
		message: {
			order: { provider, fulfillments, quote },
		},
	} = transaction;

	let { payments, items } = transaction.message.order;
	const { id, type, stops } = fulfillments[0];
	const { id: parent_item_id, location_ids, ...item } = items[0];

	const customized = checkIfCustomized(items);

	if (customized) {
	} else {
		items = items.map(
			({ location_ids, ...items }: { location_ids: any }) => items
		);
	}

	const init = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "init",
			bap_id: MOCKSERVER_ID,
			bap_uri: AGRI_SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4(),
		},
		message: {
			order: {
				provider: {
					...provider,
					locations: [{ id: uuidv4() }],
				},
				items,
				billing: {
					name: "ONDC buyer",
					address:
						"22, Mahatma Gandhi Rd, Craig Park Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
					state: {
						name: "Karnataka",
					},
					city: {
						name: "Bengaluru",
					},
					tax_id: "XXXXXXXXXXXXXXX",
					email: "nobody@nomail.com",
					phone: "9886098860",
				},
				fulfillments: [
					{
						id,
						type,
						stops: [
							{
								...stops[0],
								id: customized ? stops[0].id : undefined,
								location: {
									gps: "12.974002,77.613458",
									address: "My House #, My buildin",
									city: {
										name: "Bengaluru",
									},
									country: {
										code: "IND",
									},
									area_code: "560001",
									state: {
										name: "Karnataka",
									},
								},
								contact: {
									phone: "9886098860",
								},
								time: stops[0].time,
							},
						],
					},
				],
				payments,
			},
		},
	};
	
	await send_response(res, next, init, context.transaction_id, "init",scenario=scenario);
};
