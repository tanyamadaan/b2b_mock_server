import { Request, Response } from "express";
import { B2B_EXAMPLES_PATH, createAuthHeader, logger } from "../../lib/utils";
import axios from "axios";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const initiateController = async (req: Request, res: Response) => {
	const { transaction_id, bpp_uri, city, domain } = req.body;

	var file = fs.readFileSync(
		path.join(B2B_EXAMPLES_PATH, "on_search/on_search_fashion.yaml")
	);
	var search = YAML.parse(file.toString());
	search = {
		...search,
		context: {
			...search.context,
			location: {
				...search.context.location,
				city
			},
			transaction_id,
			bpp_uri,
			domain,
		},
	};

	const header = await createAuthHeader(req.body);
	try {
		await axios.post(`${req.body.context.bpp_uri}/search`, req.body, {
			headers: {
				"X-Gateway-Authorization": header,
				authorization: header,
			},
		});

		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
		});
	} catch (error) {
		logger.error({ type: "response", message: error });
		return res.json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				// message: (error as any).message,
				message: "Error Occurred while pinging NP at BPP URI",
			},
		});
	}
};
