import { NextFunction, Request, Response } from "express";
import {
  AGRI_SERVICES_EXAMPLES_PATH,
  SERVICES_EXAMPLES_PATH,
  checkIfCustomized,
  quoteCreatorAgriService,
  redisFetchFromServer,
  responseBuilder,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const onInitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const on_search = await redisFetchFromServer(
    "on_search",
    req.body.context.transaction_id
  );
  const providersItems = on_search?.message?.catalog?.providers[0]?.items;

  req.body.providersItems = providersItems;
  if (checkIfCustomized(req.body.message.order.items)) {
    return onInitServiceCustomizedController(req, res, next);
  }
  onInitConsultationController(req, res, next);
};

const onInitConsultationController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    context,
    providersItems,
    message: {
      order: {
        provider,
        locations,
        items,
        billing,
        fulfillments,
        payments,
        xinput,
      },
    },
  } = req.body;
  const { stops, ...remainingfulfillments } = fulfillments[0];
  const timestamp = new Date();

  const file = fs.readFileSync(
    path.join(AGRI_SERVICES_EXAMPLES_PATH, "confirm/confirm.yaml")
  );
  const response = YAML.parse(file.toString());

  const responseMessage = {
    order: {
      id: uuidv4(),
      status: response.value.message.order.status,
      provider: {
        ...provider,
        ...locations,
      },
      items,
      billing,
      fulfillments: [
        {
          ...remainingfulfillments,
          stops: stops.map(({ tags, ...stop }: { tags: any }) => {
            return {
              ...stop,
              customer: {
                person: {
                  name: "Ramu",
                },
              },
            };
          }),
        },
      ],

      quote: quoteCreatorAgriService(items, providersItems),
      payments: [
        {
          ...payments[0],
          status: "PAID",
        },
      ],
      created_at: timestamp,
      updated_at: timestamp,
      xinput,
    },
  };

  return responseBuilder(
    res,
    next,
    context,
    responseMessage,
    `${context.bpp_uri}${
      context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
    }`,
    `confirm`,
    "agri-services"
  );
};

const onInitServiceCustomizedController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    context,
    providersItems,
    message: {
      order: {
        provider,
        locations,
        items,
        billing,
        fulfillments,
        payments,
        xinput,
      },
    },
  } = req.body;
  const { stops, ...remainingfulfillments } = fulfillments[0];

  const file = fs.readFileSync(
    path.join(SERVICES_EXAMPLES_PATH, "confirm/confirm_consultation.yaml")
  );
  const response = YAML.parse(file.toString());

  const responseMessage = {
    order: {
      id: uuidv4(),
      status: response.value.message.order.status,
      provider: {
        ...provider,
        locations: [locations[0]],
      },
      items,
      billing,
      fulfillments: [
        {
          ...remainingfulfillments,
          stops: stops.map(({ tags, ...stop }: { tags: any }) => {
            return {
              ...stop,
              customer: {
                person: {
                  name: "Ramu",
                },
              },
            };
          }),
        },
      ],
      quote: quoteCreatorAgriService(items, providersItems),
      payments: [
        {
          ...payments[0],
          status: "PAID",
        },
      ],
      created_at: "2023-02-03T09:30:00.000Z",
      updated_at: "2023-02-03T09:30:00.000Z",
      xinput,
    },
  };
  return responseBuilder(
    res,
    next,
    context,
    responseMessage,
    `${context.bpp_uri}${
      context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
    }`,
    `confirm`,
    "services"
  );
};
