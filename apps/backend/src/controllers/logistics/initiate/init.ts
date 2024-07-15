import { NextFunction, Request, Response } from "express";
import {
	LOGISTICS_BAP_MOCKSERVER_URL,
	LOGISTICS_EXAMPLES_PATH,
	MOCKSERVER_ID,
	send_response,
	redis,
	send_nack,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateInitController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
		const transactionKeys = await redis.keys(`${transactionId}-*`);
		const ifTransactionExist = transactionKeys.filter((e) =>
			e.includes("on_search-from-server")
		);
		if (ifTransactionExist.length === 0) {
			return send_nack(res, "On Search doesn't exist");
		}
		const transaction = await redis.mget(ifTransactionExist);
		const parsedTransaction = transaction.map((ele) => {
			return JSON.parse(ele as string);
		});

		const request = parsedTransaction[0].request;
		if (Object.keys(request).includes("error")) {
			return send_nack(res, "On Search had errors");
		}
    let bpp_uri = request.context.bpp_uri;
    let city = request.context.location.city.code;
		let domain = request.context.domain;
		let init;
		switch (domain) {
			case "ONDC:LOG10":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/init/init_air.yaml"
					)
				);
				init = YAML.parse(file.toString());
				break;
			case "ONDC:LOG11":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/init/init_air.yaml"
					)
				);
				init = YAML.parse(file.toString());
				break;
			default:
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/init/init_air.yaml"
					)
				);
				init = YAML.parse(file.toString());
				break;
		}
    init = init.value;
    init = {
      ...init,
      context: {
        ...init.context,
        timestamp: new Date().toISOString(),
        location: {
          ...init.context.location,
          city: {
            code: city,
          },
        },
        transaction_id: transactionId,
        message_id: uuidv4(),
        bpp_id: MOCKSERVER_ID,
        bpp_uri,
        domain,
        bap_id: MOCKSERVER_ID,
        bap_uri: LOGISTICS_BAP_MOCKSERVER_URL,
      },
    };
    await send_response(res, next, init, transactionId, "init");
	} catch (error) {
		return next(error);
	}
};
