import { NextFunction, Request, Response } from "express";
import {
  send_nack,
  createAuthHeader,
  redis,
  redisFetchToServer,
  B2B_BAP_MOCKSERVER_URL,
  MOCKSERVER_ID,
  Stop,
  Fulfillment,
  send_response,
  Item,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { selectController } from "../bpp/select";

export const initiateUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { scenario, transactionId } = req.body;
  // const transactionKeys = await redis.keys(`${transactionId}-*`);
  // const ifTransactionExist = transactionKeys.filter((e) =>
  // 	e.includes("on_confirm-to-server")
  // );
  // if (ifTransactionExist.length === 0) {
  // 	return res.status(400).json({
  // 		message: {
  // 			ack: {
  // 				status: "NACK",
  // 			},
  // 		},
  // 		error: {
  // 			message: "On Confirm doesn't exist",
  // 		},
  // 	});
  // }

  // const transaction = await redis.mget(ifTransactionExist);
  // const parsedTransaction = transaction.map((ele) => {
  // 	return JSON.parse(ele as string);
  // });
  const on_confirm = await redisFetchToServer("on_confirm", transactionId);
  if (!on_confirm) {
    return send_nack(res, "On Confirm doesn't exist");
  }
  //on_select to fetch items for reschedule
  const on_select = await redisFetchToServer("on_select", transactionId);

  const { context, message } = on_confirm;
  const timestamp = new Date().toISOString();
  context.action = "update";
  context.timestamp = timestamp;

  let responseMessage;
  switch (scenario) {
    case "payments":
      responseMessage = requoteRequest(message);
      break;
    case "reschedule":
      responseMessage = rescheduleRequest(
        message,
        on_select.message.order.items
      );
      break;
    default:
      responseMessage = requoteRequest(message);
      break;
  }
  const update = {
    context,
    message: responseMessage,
  }
  const header = await createAuthHeader(update);

  try {
    await redis.set(
      `${transactionId}-update-from-server`,
      JSON.stringify({ request: { ...update } })
    );
    const response = await axios.post(`${context.bpp_uri}/update`, update, {
      headers: {
        // "X-Gateway-Authorization": header,
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
    console.log("ERROR", (error as any)?.response.data.error);
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
  fulfillments.map((itm: Fulfillment) => {
    itm.state.descriptor.code = "Completed";
  });

  const responseMessage = {
    update_target: "payments",
    order: {
      id: message.order.id,
      status: message.order.status,
      provider: {
        id: message.order.provider.id,
      },
      items,
      payments,
      fulfillments: fulfillments.map((itm: Fulfillment) => ({
        ...itm,
        stops: itm.stops.map((stop: Stop) => ({
          ...stop,
        })),
      })),
      quote,
    },
  };
  return responseMessage;
}

function rescheduleRequest(message: any, items: Item[]) {
  let {
    order: { payments, fulfillments, quote },
  } = message;

  const responseMessage = {
    update_target: "fulfillments",
    order: {
      id: message.order.id,
      status: message.order.status,
      provider: {
        id: message.order.provider.id,
        locations: message.order.provider?.locations,
      },
      items,
      payments,
      fulfillments: fulfillments.map(
        (itm: Fulfillment) => ({
          ...itm,
          stops: itm.stops.map((stop: Stop) => ({
            ...stop,
            time: {
              label: stop.time?.label ? "selected" : undefined,
              ...stop.time,
            },
          })),
        })
      ),
      quote,
    },
  };
  return responseMessage;
}
