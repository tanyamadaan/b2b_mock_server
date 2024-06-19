import { NextFunction, Request, Response } from "express";
import {
  SERVICES_EXAMPLES_PATH,
  checkIfCustomized,
  // quoteCreatorService,
  // quoteCreatorServiceCustomized,
  responseBuilder,
  send_nack,
  redis,
  Stop,
  redisFetchFromServer,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transaction_id } = req.body.context;

    const on_select = await redisFetchFromServer("on_select", transaction_id);
    req.body.message.order.quote = on_select?.message?.order?.quote;
    if (!on_select) {
      return send_nack(res, "On Select doesn't exist");
    }

    if (checkIfCustomized(req.body.message.order.items)) {
      return initServiceCustomizationController(req, res, next);
    }
    return initConsultationController(req, res, next);
  } catch (error) {
    return next(error);
  }
};
const initConsultationController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      context,
      message: {
        order: { provider, items, billing, fulfillments, payments, quote },
      },
    } = req.body;

    const { locations, ...remainingProvider } = provider;
    const { stops, ...remainingfulfillments } = fulfillments[0];

    const file = fs.readFileSync(
      path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_consultation.yaml")
    );
    const response = YAML.parse(file.toString());
    const responseMessage = {
      order: {
        provider: remainingProvider,
        locations,
        items: [items[0]],
        billing,
        fulfillments: [
          {
            ...remainingfulfillments,
            tracking: false,
            stops: stops?.map((stop: Stop) => {
              return {
                ...stop,
                tags: {
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
                },
              };
            }),
          },
        ],
        // quote: quoteCreatorService(items),
        quote: quote,
        payments: [
          {
            id: payments[0]?.id,
            type: payments[0]?.type,
            ...response.value.message.order.payments[0],
          },
        ],
        xinput: response.value.message.order.xinput,
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
      }`,
      `on_init`,
      "services"
    );
  } catch (error) {
    return next(error);
  }
};

const initServiceCustomizationController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      context,
      message: {
        order: { provider, items, billing, fulfillments, payments, quote },
      },
    } = req.body;

    const { locations, ...remainingProvider } = provider;
    const { stops, ...remainingfulfillments } = fulfillments[0];

    const file = fs.readFileSync(
      path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_consultation.yaml")
    );
    const response = YAML.parse(file.toString());
    // splice to insert element at index 0
    stops.splice(0, 0, {
      type: "start",
      instructions: {
        name: "Instuctions by provider",
        short_desc: "Instuctions by provider",
        long_desc: "Instuctions by provider",
        additional_desc: {
          url: "https//abc.com/checklist",
          content_type: "text/html",
        },
      },
    });
    // console.log("Customized ;:", stops)
    const responseMessage = {
      order: {
        provider: remainingProvider,
        locations,
        items: items,
        billing,
        fulfillments: [
          {
            ...remainingfulfillments,
            tracking: false,
            stops,
          },
        ],
        quote: quote,
        payments: [
          {
            id: payments[0]?.id,
            type: payments[0]?.type,
            ...response.value?.message?.order?.payments[0],
          },
        ],
        xinput: response.value.message.order.xinput,
      },
    };
    return responseBuilder(
      res,
      next,
      context,
      responseMessage,
      `${req.body.context.bap_uri}${
        req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
      }`,
      `on_init`,
      "services"
    );
  } catch (error) {
    return next(error);
  }
};

// const initServiceController = (req: Request, res: Response) => {
// 	const { context } = req.body;
// 	const file = fs.readFileSync(
// 		path.join(SERVICES_EXAMPLES_PATH, "on_init/on_init_service.yaml")
// 	);
// 	const response = YAML.parse(file.toString());
// 	return responseBuilder(
// 		res,
// 		context,
// 		response.value.message,
// 		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_init" : "/on_init"
// 		}`,
// 		`on_init`,
// 		"services"
// 	);
// };
