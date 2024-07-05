import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
	Fulfillment,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const confirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
  const sandboxMode = res.getHeader("mode") === "sandbox";
if(!sandboxMode) {
	try {
    //console.log(req)
    const domain = req.body.context.domain;

		let response;
		switch (domain) {
			case "ONDC:LOG10":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_confirm/on_confirm_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
			case "ONDC:LOG11":
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Int_Logistics_yaml/on_confirm/on_confirm_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
			default:
				var file = fs.readFileSync(
					path.join(
						LOGISTICS_EXAMPLES_PATH,
						"/B2B_Dom_Logistics_yaml/on_confirm/on_confirm_air.yaml"
					)
				);
				response = YAML.parse(file.toString());
				break;
		}

    return responseBuilder_logistics(
      res,
      next,
      response.value.context,
      response.value.message,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
      }`,
      `on_confirm`,
      "logistics"
    );

	} catch (error) {
		return next(error);
	}
}else{
  // let response;
  // const { context, message } = req.body;
  //   const start = new Date(message.order.created_at);
  //   start.setHours(start.getHours() + 1);
  //   const end = new Date(message.order.created_at);
  //   end.setHours(end.getHours() + 2);
  //   const responseMessage = {
  //     order: {
  //       ...message.order,
  //       ...message.items,
  //       state: "Accepted",
  //       provider: {
  //         ...message.order.provider,
  //         rateable: true,
  //       },
  //       fulfillments: message.order.fulfillments.map(
  //         (eachFulfillment: Fulfillment) => ({
  //           ...eachFulfillment,
  //           "@ondc/org/provider_name":
  //             response.value.message.order.fulfillments[0][
  //               "@ondc/org/provider_name"
  //             ],
  //           state: response.value.message.order.fulfillments[0].state,
  //           stops: [
  //             ...eachFulfillment.stops,
  //             {
  //               ...response.value.message.order.fulfillments[0].stops[0],
  //               time: {
  //                 range: {
  //                   start: start.toISOString(),
  //                   end: end.toISOString(),
  //                 },
  //               },
  //             },
  //           ],
  //         })
  //       ),
  //     },
  //   };
  //   return responseBuilder(
  //     res,
  //     next,
  //     context,
  //     responseMessage,
  //     `${req.body.context.bap_uri}${
  //       req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
  //     }`,
  //     `on_confirm`,
  //     "logistics"
  //   );
}
};
