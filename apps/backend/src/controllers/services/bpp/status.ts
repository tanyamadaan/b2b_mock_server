import { NextFunction, Request, Response } from "express";

import {
  Fulfillment,
  SERVICES_EXAMPLES_PATH,
  Stop,
  checkIfCustomized,
  redisExistFromServer,
  redisFetchFromServer,
  responseBuilder,
  send_nack,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { fullFormats } from "ajv-formats/dist/formats";
export const statusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let scenario: string = String(req.query.scenario) || "";
  const { transaction_id } = req.body.context;

  const on_confirm_data = await redisFetchFromServer(
    "on_confirm",
    transaction_id
  ); //from
  if (!on_confirm_data) {
    return send_nack(res, "on confirm doesn't exist");
  }

  const on_cancel_exist = await redisExistFromServer(
    "on_cancel",
    transaction_id
  );
  if (on_cancel_exist) {
    scenario = "cancel";
  }
  // console.log("Senario ---", scenario);

  return statusRequest(req, res, next, on_confirm_data, scenario);
};
const statusRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  const { context, message } = transaction;
  // modifying context
  context.action = "on_status";

  const timestamp = new Date().toISOString();
  const responseMessage: any = {
    order: {
      id: message?.order?.id,
      status: "In-progress",
      provider: {
        ...message?.order?.provider,
        rateable: undefined,
      },
      items: message?.order?.items,
      billing: { ...message.order?.billing, tax_id: undefined },
      fulfillments: message.order?.fulfillments?.map(
        (fulfillment: Fulfillment) => ({
          ...fulfillment,
          id: fulfillment.id,
          state: {
            descriptor: {
              code: "At-Location",
            },
          },
          stops: fulfillment.stops.map((stop: Stop) => {
            const demoObj = {
              ...stop,
              id: undefined,
              authorization: stop.authorization
                ? { ...stop.authorization, status: "confirmed" }
                : undefined,
              person: stop.person ? stop.person : stop.customer?.person,
            };
            if (stop.type === "start") {
              return {
                ...demoObj,
                location: {
                  ...stop.location,
                  descriptor: {
                    ...stop.location?.descriptor,
                    images: ["https://gf-integration/images/5.png"],
                  },
                },
              };
            }
            return demoObj;
          }),
          rateable: undefined,
        })
      ),
      quote: message?.order?.quote,
      payments: message?.order?.payments,
      documents: [
        {
          url: "https://invoice_url",
          label: "INVOICE",
        },
      ],
      created_at: message?.order?.created_at,
      updated_at: message?.order?.updated_at,
    },
  };
  switch (scenario) {
    case "in-transit":
      responseMessage.order.fulfillments?.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "In-Transit";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
      });
      break;
    case "reached":
      responseMessage.order.fulfillments?.forEach((fulfillment: Fulfillment) => {
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization
            ? (stop.authorization = { ...stop.authorization, status: "valid" })
            : undefined
        );
      });
      break;
    case "completed":
      responseMessage.order.status = "Completed";
      responseMessage.order.fulfillments?.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "Completed";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
      });
      break;
    case "cancel":
      responseMessage.order.status = "Cancelled";
      break;
    default: //service started is the default case
      break;
  }
  return responseBuilder(
    res,
    next,
    req.body.context,
    responseMessage,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
    }`,
    `on_status`,
    "services"
  );
};
// export const statusController = (req: Request, res: Response, next: NextFunction) => {
// // 	const { scenario } = req.query
// 	switch (scenario) {
// 		case 'completed':
// 			statusCompletedController(req, res, next)
// 			break;
// 		case 'in-transit':
// 			statusInTransitController(req, res, next)
// 			break;
// 		case 'reached-re-otp':
// 			statusReachedReOtpController(req, res, next)
// 			break;
// 		case 'reached':
// 			statusReachedController(req, res, next)
// 			break;
// 		case 'service-started':
// 			if (checkIfCustomized(req.body.message.providers[0].items)) {
// 				// return onSelectServiceCustomizedController(req, res);
// 			}
// 			statusServiceStartedController(req, res, next)
// 			break;
// 		default:
// 			statusCompletedController(req, res, next)//default senario : completed
// 			break;
// 	}
// }

// const statusCompletedController = (req: Request, res: Response, next: NextFunction) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Completed.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
// 		}`,
// 		`on_status`,
// 		"services"
// 	);
// };

// const statusInTransitController = (req: Request, res: Response, next: NextFunction) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_In_Transit.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
// 		}`,
// 		`on_status`,
// 		"services"
// 	);
// };

// const statusReachedReOtpController = (req: Request, res: Response, next: NextFunction) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached_re-otp.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
// 		}`,
// 		`on_status`,
// 		"services"
// 	);
// };
// const statusReachedController = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction

// ) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Reached.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
// 		}`,
// 		`on_status`,
// 		"services"
// 	);
// };

// const statusServiceStartedController = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_status/on_status_Service_Started.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
// 		}`,
// 		`on_status`,
// 		"services"
// 	);
// };
