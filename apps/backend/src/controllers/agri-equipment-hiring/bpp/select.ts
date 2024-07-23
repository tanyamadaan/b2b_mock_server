import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  SERVICES_EXAMPLES_PATH,
  responseBuilder,
  quoteCreatorService,
  quoteCreatorServiceCustomized,
  checkIfCustomized,
  redis,
  Stop,
  Time,
  redisFetchFromServer,
  send_nack,
} from "../../../lib/utils";
import path from "path";
import fs from "fs";
import YAML from "yaml";

export const selectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario } = req.query;
    const on_search = await redisFetchFromServer(
      "on_search",
      req.body.context?.transaction_id
    );
    if (!on_search) {
      return send_nack(res, "On Search doesn't exist");
    }
    const providersItems = on_search?.message?.catalog?.providers[0]?.items;
    req.body.providersItems = providersItems;

    switch (scenario){
      // schedule_confirmed, schedule_rejected
      // case "schedule_confirmed":
      //   if (checkIfCustomized(req.body.message?.order?.items)){
      //     return selectServiceCustomizationConfirmedController(req, res, next);
      //   }
      //   selectConsultationConfirmController(req, res, next);
      //   break;
      case "schedule_rejected ":
        selectConsultationRejectController(req, res, next);
        break;
      default:
        if (checkIfCustomized(req.body.message?.order?.items)) {
          return selectServiceCustomizationConfirmedController(req, res, next);
        }
        return selectConsultationConfirmController(req, res, next);
    }
  } catch (error) {
    return next(error);
  }
};

const selectConsultationConfirmController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { context, message } = req.body;
    const { locations, ...provider } = message?.order?.provider;
    var responseMessage = {
      order: {
        provider,
        payments: message?.order?.payments?.map(
          ({ type }: { type: string }) => ({
            type,
            collected_by: "BAP",
          })
        ),
        items: message?.order?.items.map(
          ({ ...remaining }: { location_ids: string[]; remaining: any }) => ({
            ...remaining,
            fulfillment_ids: [uuidv4()],
          })
        ),
        fulfillments: message?.order?.fulfillments?.map(
          ({
            id,
            stops,
            ...each
          }: {
            id: string;
            stops: Stop[];
            each: any;
          }) => ({
            ...each,
            id,
            tracking: false,
            state: {
              descriptor: {
                code: "Serviceable",
              },
            },
            stops: stops.map((stop: Stop) => {
              if (stop.time) {
                stop.time.label = "confirmed";
              }
              stop.tags = {
                descriptor: {
                  code: "schedule",
                },
                list: [
                  {
                    descriptor: {
                      code: "ttl",
                    },
                    value: "PT1H",
                  },
                ],
              };
              // else
              // stop.time.label = "rejected"
              return stop;
            }),
          })
        ),
        quote: quoteCreatorService(
          message.order.items,
          req.body?.providersItems
        ),
      },
    };

    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
      }`,
      `on_select`,
      "services"
    );
  } catch (error) {
    return next(error);
  }
};

const selectConsultationRejectController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { context } = req.body;
    const file = fs.readFileSync(
      path.join(
        SERVICES_EXAMPLES_PATH,
        "on_select/on_select_consultation_rejected.yaml"
      )
    );
    const response = YAML.parse(file.toString());

    return responseBuilder(
      res,
      next,
      context,
      response.value.message,
      `${context.bap_uri}/on_select`,
      `on_select`,
      "services"
    );
  } catch (error) {
    return next(error);
  }
};

const selectServiceCustomizationConfirmedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { context, message } = req.body;
    const { locations, ...provider } = message.order.provider;
    const { id, parent_item_id, location_ids, quantity, ...item } =
      message?.order?.items[0];
    const transactionKeys = await redis.keys(`${context.transaction_id}-*`);
    const ifTransactionToExist = transactionKeys.filter((e) =>
      e.includes("on_search-to-server")
    );

    const ifTransactionFromExist = transactionKeys.filter((e) =>
      e.includes("on_search-from-server")
    );

    const raw = await redis.mget(
      ifTransactionToExist ? ifTransactionToExist : ifTransactionFromExist
    );
    const onSearchHistory = raw.map((ele) => {
      return JSON.parse(ele as string);
    })[0].request;

    const fulfillment = message?.order?.fulfillments[0];

    const fulfillment_id =
      onSearchHistory.message?.catalog?.fulfillments.filter(
        (e: { type: string }) => e.type === fulfillment?.type
      )[0]?.id;

    const responseMessage = {
      order: {
        provider,
        payments: message?.order?.payments?.map(
          ({ type }: { type: string }) => ({
            type,
            collected_by: "BAP",
          })
        ),
        items: [
          {
            id,
            parent_item_id,
            location_ids,
            quantity,
            fulfillment_ids: [uuidv4()],
          },
          ...message?.order?.items
            ?.slice(1)
            .map(
              ({
                location_ids,
                ...remaining
              }: {
                location_ids: string[];
                remaining: any;
              }) => ({
                ...remaining,
                location_ids,
                fulfillment_ids: [uuidv4()],
              })
            ),
        ],
        fulfillments:
          // message.order.fulfillments.map(
          // 	({ stops, type, ...each }: any) => ({
          // 		id: fulfillment_id,
          // 		type,
          // 		tracking: false,
          // 		state: {
          // 			descriptor: {
          // 				code: "Serviceable",
          // 			},
          // 		},
          // 		stops,
          // 	})
          // )
          [
            {
              ...fulfillment,
              id: fulfillment_id,
              tracking: false,
              state: {
                descriptor: {
                  code: "Serviceable",
                },
              },
              stops: fulfillment?.stops?.map((e: { time: Time }) => ({
                ...e,
                time: { ...e.time, label: "confirmed" },
              })),
            },
          ],
        quote: quoteCreatorServiceCustomized(
          message.order.items,
          req.body?.providersItems
        ),
      },
    };

    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${context.bap_uri}/on_select`,
      `on_select`,
      "services"
    );
  } catch (error) {
    return next(error);
  }
};

// const selectServiceConfirmController = (req: Request, res: Response) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(
// 			SERVICES_EXAMPLES_PATH,
// 			"on_select/on_select_service_confirmed.yaml"
// 		)
// 	);
// 	const response = YAML.parse(file.toString());

// 	return responseBuilder(
// 		res,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
// 		}`,
// 		`on_select`,
// 		"services"
// 	);
// };

// const selectServiceRejectController = (req: Request, res: Response) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(
// 			SERVICES_EXAMPLES_PATH,
// 			"on_select/on_select_service_rejected.yaml"
// 		)
// 	);
// 	const response = YAML.parse(file.toString());

// 	return responseBuilder(
// 		res,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_select" : "/on_select"
// 		}`,
// 		`on_select`,
// 		"services"
// 	);
// }

