import { NextFunction, Request, Response } from "express";
import {
  SERVICES_BAP_MOCKSERVER_URL,
  MOCKSERVER_ID,
  checkIfCustomized,
  send_response,
  send_nack,
  redisFetchToServer,
  Stop,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";

export const initiateConfirmController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scenario, transactionId } = req.body;
   
    const on_init = await redisFetchToServer("on_init", transactionId);
    if (!on_init) {
      return send_nack(res, "On Init doesn't exist");
    }
    return intializeRequest(res, next, on_init, scenario);
  } catch (error) {
    return next(error);
  }
};

const intializeRequest = async (
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  try {
    const {
      context,
      message: {
        order: {
          provider,
          locations,
          payments,
          fulfillments,
          xinput,
          items,
          quote,
        },
      },
    } = transaction;
    const { transaction_id } = context;
    const { stops, ...remainingfulfillments } = fulfillments[0];

    const timestamp = new Date().toISOString();

    const customized = checkIfCustomized(items);
    // console.log("Xinput ::", xinput)
    const confirm = {
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        action: "confirm",
        bap_id: MOCKSERVER_ID,
        bap_uri: SERVICES_BAP_MOCKSERVER_URL,
        message_id: uuidv4(),
      },
      message: {
        order: {
          ...transaction.message.order,
          id: uuidv4(),
          status: "Created",
          provider: {
            ...provider,
            locations,
          },
          items,
          fulfillments: [
            {
              ...remainingfulfillments,
              stops: stops?.map((stop: Stop) => {
                return {
                  ...stop,
                  contact: {
                    ...stop?.contact,
                    email:
                      stop.contact && stop.contact.email
                        ? stop.contact.email
                        : "nobody@nomail.com",
                  },
                  customer: {
                    person: {
                      name: "Ramu",
                    },
                  },
                  tags: undefined,
                };
              }),
            },
          ],
          quote: quote,
          payments: [
            {
              //hardcoded transaction_id
              ...payments[0],
              params: {
                ...payments[0].params,
                transaction_id: "xxxxxxxx",
              },
              status: "PAID",
            },
          ],
          created_at: timestamp,
          updated_at: timestamp,
          xinput: {
            ...xinput,
            form: {
              ...xinput?.form,
              submission_id: "xxxxxxxxxx",
              status: "SUCCESS",
            },
          },
        },
      },
    };
    confirm.message.order.quote.breakup?.forEach((itm: any) => {
      itm.item.quantity = {
        selected: {
          count: 3,
        },
      };
    });
    await send_response(
      res,
      next,
      confirm,
      transaction_id,
      "confirm",
      (scenario = scenario)
    );
  } catch (error) {
    next(error);
  }
};
