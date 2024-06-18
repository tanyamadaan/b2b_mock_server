import { NextFunction, Request, Response } from "express";
import {
  Item,
  Payment,
  Quantity,
  Stop,
  responseBuilder,
  Select,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { or } from "ajv/dist/compile/codegen";

export const updateController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { scenario } = req.query;
  switch (scenario) {
    case "requote":
      updateRequoteController(req, res, next);
      break;
    case "reschedule":
      updateRescheduleController(req, res, next);
      break;
    default:
      updateRequoteController(req, res, next);
      break;
  }
};

// export const updateRequoteController = (req: Request, res: Response, next: NextFunction) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_update/on_update_requote.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		next,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${
// 			req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
// 		}`,
// 		`on_update`,
// 		"services"
// 	);
// };
export const updateRequoteController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    context,
    message: { order },
  } = req.body;
  //   const { fulfillments } = order;
  const responseMessage = {
    order: {
      id: order?.id,
      status: "Pending",
      provider: order?.provider,
      items: order?.items?.map((itm: Item) => ({
        ...itm,
        quantity: {
          selected: {
            count: (itm.quantity as Quantity)?.unitized?.measure?.value|| (itm.quantity as Select)?.selected?.count,
            measure: {
              unit: (itm.quantity as Quantity)?.unitized?.measure?.unit,
            },
          },
        },
      })),
      payments: order?.payments?.map((pay: Payment) => ({
        ...pay,
        params: {
          ...pay.params,
          transaction_id: undefined,
        },
      })),
      fulfillments: order?.fulfillments,
      quote: order?.quote,
    },
  };
  context.action = "on_update";
  return responseBuilder(
    res,
    next,
    context,
    responseMessage,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
    }`,
    `on_update`,
    "services"
  );
};

export const updateRescheduleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    context,
    message: { order },
  } = req.body;
  // const file = fs.readFileSync(
  // 	path.join(SERVICES_EXAMPLES_PATH, "on_update/on_update_reschedule.yaml")
  // );
  // const response = YAML.parse(file.toString());
  const responseMessage = {
    ...order,
    fulfillments: [
      {
        ...order.fulfillments[0],
        stops: order.fulfillments[0]?.stops?.map((stop: Stop) => ({
          ...stop,
          time:
            stop.type === "end"
              ? { ...stop.time, label: "confirmed" }
              : stop.time,
        })),
      },
    ],
    payments:order?.payments?.map((pay:Payment)=>({
      ...pay,
      params:{
        ...pay?.params,
        transaction_id:undefined
      }
    }))
  };
  return responseBuilder(
    res,
    next,
    context,
    responseMessage,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_update" : "/on_update"
    }`,
    `on_update`,
    "services"
  );
};
