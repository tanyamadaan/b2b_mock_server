import { NextFunction, Request, Response } from "express";
import {
  responseBuilder,
  redisFetchFromServer,
  send_nack,
  Item,
  Fulfillment,
  Payment,
  Tag,
} from "../../../lib/utils";

interface Accumulator {
  [key: string]: string | undefined;
}

export const cancelController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { scenario } = req.query;
  const { transaction_id } = req.body.context;

  const on_confirm_data = await redisFetchFromServer(
    "on_confirm",
    transaction_id
  ); //from
  if (!on_confirm_data) {
    return send_nack(res, "on confirm doesn't exist");
  }
  if (on_confirm_data.message.order?.id != req.body.message?.order_id) {
    return send_nack(res, "Order id does not exist");
  }

  const on_search_data = await redisFetchFromServer(
    "on_search",
    transaction_id
  );

  // console.log("Search ::", parsedSearch[0].request.message.catalog.providers[0].items)
  const provider_id = on_confirm_data.message.order.provider?.id;

  const item_measure_ids =
    on_search_data.message.catalog?.providers[0]?.items?.reduce(
      (accumulator: Accumulator, currentItem: any) => {
        accumulator[currentItem.id] = currentItem.quantity
          ? currentItem.quantity.unitized?.measure
          : undefined;
        return accumulator;
      },
      {}
    );
  req.body.item_measure_ids = item_measure_ids;
  cancelRequest(req, res, next, on_confirm_data);
};

const cancelRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any
) => {
  const { context } = req.body;

  const responseMessage = {
    order: {
      id: req.body.message.order_id,
      status: "Cancelled",
      cancellation: {
        cancelled_by: "CONSUMER",
        reason: {
          descriptor: {
            code: req.body.message.cancellation_reason_id,
          },
        },
      },
      provider: {
        ...transaction.message.order.provider,
        rateable: undefined,
      },
      items: transaction.message.order.items.map((itm: Item) => ({
        ...itm,
        quantity: {
          ...itm.quantity,
          measure: req.body.item_measure_ids[itm.id]
            ? req.body.item_measure_ids[itm.id]
            : { unit: "", value: "" },
        },
      })),
      quote: transaction.message.order.quote,
      fulfillments: transaction.message.order.fulfillments?.map(
        (fulfillment: Fulfillment) => ({
          ...fulfillment,
          state: {
            ...fulfillment.state,
            descriptor: {
              code: "Cancelled",
            },
          },
          rateable: undefined,
        })
      ),
      billing: transaction.message.order.billing,
      payments: transaction.message.order.payments?.map((itm: Payment) => ({
        ...itm,
        tags: itm.tags.filter(
          (tag: Tag) => tag.descriptor.code !== "Settlement_Counterparty"
        ),
      })),
      updated_at: new Date().toISOString(),
    },
  };

  return responseBuilder(
    res,
    next,
    context,
    responseMessage,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_cancel" : "/on_cancel"
    }`,
    `on_cancel`,
    "b2b"
  );
};
