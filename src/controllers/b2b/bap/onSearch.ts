import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { selectDomestic } from "../../../lib/examples";

export const onSearchController = (req: Request, res: Response) => {
	const domain = req.body.context.domain;
	var ts = new Date(req.body.context.timestamp);
	ts.setSeconds(ts.getSeconds() + 1);
	const context = {
		...req.body.context,
		action: "select",
		// bpp_id: "b2b.ondc-mockserver.com",
		// bpp_uri: "b2b.ondc-mockserver.com/url",
		message_id: uuidv4(),
		timeStamp: ts.toISOString(),
	};
	return res.json({
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
		async: {
			context,
			message: selectDomestic.message,
		},
	});
};
