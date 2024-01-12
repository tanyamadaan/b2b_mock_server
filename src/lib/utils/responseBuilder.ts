import axios from "axios";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MOCKSERVER_ID, MOCKSERVER_URL } from "./constants";
import { createResponseAuthHeader } from "./responseAuth";

export const responseBuilder = async (
	res: Response,
	reqContext: object,
	message: object,
	uri: string,
	action: boolean = true
) => {
	var ts = new Date((reqContext as any).timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
	const sandboxMode = process.env.SANDBOX_MODE;
	var async: { message: object; context?: object } = { message };

	if (action) {
		const { bap_uri, bap_id, ...context } = reqContext as any;
		async = {
			...async,
			context: {
				...context,
				bpp_id: MOCKSERVER_ID,
				bpp_uri: MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
			},
		};
	} else {
		const { bpp_uri, bpp_id, ...context } = reqContext as any;
		async = {
			...async,
			context: {
				...context,
				bap_id: MOCKSERVER_ID,
				bap_uri: MOCKSERVER_URL,
				timeStamp: ts.toISOString(),
				message_id: uuidv4(),
			},
		};
	}
	const header = await createResponseAuthHeader(async);
	res.setHeader("authorization", header);
	if (sandboxMode) {
		const response = await axios.post(uri, async, {
			headers: {
				authorization: header,
			},
		});
		if (response.status !== 200) {
			console.log(
				"ERROR Ocurred while sending response to Mocker:",
				response.statusText
			);
			return res.json({
				message: {
					ack: {
						status: "NACK",
					},
				},
			});
		}
		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
		});
	} else {
		return res.json({
			sync: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			async,
		});
	}
};
