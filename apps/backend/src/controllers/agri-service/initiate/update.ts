import { NextFunction, Request, Response } from "express";
import {
  send_nack,
  createAuthHeader,
  redis,
  redisFetch,
  AGRI_SERVICES_BPP_MOCKSERVER_URL,
} from "../../../lib/utils";
import axios from "axios";

export const initiateUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { scenario, transactionId } = req.body;
  const on_confirm = await redisFetch("on_confirm", transactionId);

  if (!on_confirm) {
    send_nack(res, "On Confirm doesn't exist");
  }

  on_confirm.context.bpp_uri = AGRI_SERVICES_BPP_MOCKSERVER_URL
  const { context, message } = on_confirm;

  const timestamp = new Date().toISOString();
  context.action = "update";
  context.timestamp = timestamp;

  switch (scenario) {
    case "requote":
      var responseMessage = requoteRequest(message);
      break;
    case "reschedule":
      // var responseMessage = rescheduleRequest(message)
      break;
    default:
      var responseMessage = requoteRequest(message);
      break;
  }

  const update = {
    context,
    message:{
      update_target:"payments",
      order:{
        id:message.order.id,
        fulfillments:[{
          id:"C1",
          type:"Cancel"
        }],
        payments:{
          tags:message.order.payments[0].tags
        }
      }
    }
  };

  const header = await createAuthHeader(update);

  try {
    await redis.set(
      `${transactionId}-update-from-server`,
      JSON.stringify({ request: { ...update } })
    );

    const response = await axios.post(`${context.bpp_uri}/update`, update, {
      headers: {
        authorization: header,
      },
    });

    await redis.set(
      `${transactionId}-update-from-server`,
      JSON.stringify({
        request: { ...update },
        response: {
          response: response.data,
          timestamp: new Date().toISOString(),
        },
      })
    );

    return res.json({
      message: {
        ack: {
          status: "ACK",
        },
      },
      transactionId,
    });
  } catch (error) {
    return next(error);
  }
};

function requoteRequest(message: any) {
  let {
    order: { items, payments, fulfillments, quote },
  } = message;
  items = items.map(
    ({
      id,
      parent_item_id,
      ...every
    }: {
      id: string;
      parent_item_id: object;
    }) => ({
      ...every,
      id,
      parent_item_id,
    })
  );
  fulfillments.map((itm: any) => {
    itm.state.descriptor.code = "Completed";
  });

  const responseMessage = {
    id: message.order.id,
    state: message.order.state,
    update_target: "payments",
    provider: {
      id: message.order.provider.id,
    },
    items,
    payments,
    fulfillments: fulfillments.map((itm: any) => ({
      ...itm,
      stops: itm.stops.map((stop: any) => ({
        ...stop,
      })),
    })),
    quote,
  };
  return responseMessage;
}

function rescheduleRequest(message: any) { }
