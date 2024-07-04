
import { NextFunction, Request, Response } from "express";
import { AGRI_HEALTHCARE_STATUS } from "../../../lib/utils/apiConstants";

import {
  Fulfillment,
  Stop,
  redisExistFromServer,
  redisFetchFromServer,
  responseBuilder,
  send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const statusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    let scenario: string = String(req.query.scenario) || "";
    const { transaction_id } = req.body.context;
  
    const on_confirm_data = await redisFetchFromServer(
      ON_ACTION_KEY.ON_CONFIRM,
      transaction_id
    ); //from
    if (!on_confirm_data) {
      return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
    }
  
    const on_cancel_exist = await redisExistFromServer(
      ON_ACTION_KEY.ON_CANCEL,
      transaction_id
    );
    if (on_cancel_exist) {
      scenario = "cancel";
    }
    return statusRequest(req, res, next, on_confirm_data, scenario);
  }catch(error){
    return next(error)
  }
};

const statusRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
try{
  const { context, message } = transaction;
  context.action = ON_ACTION_KEY.ON_STATUS;
  const on_status = await redisFetchFromServer(ON_ACTION_KEY.ON_STATUS, req.body.context.transaction_id);

  let next_status = scenario;
  if (on_status) {
    //UPDATE SCENARIO TO NEXT STATUS
    const lastStatus = on_status?.message?.order?.fulfillments[0]?.state?.descriptor?.code
    //FIND NEXT STATUS

    const lastStatusIndex = AGRI_HEALTHCARE_STATUS.indexOf(lastStatus);

    if(lastStatus === 6){
      next_status = lastStatus
    }
    if (lastStatusIndex !== -1 && lastStatusIndex < AGRI_HEALTHCARE_STATUS.length - 1) {
      const nextStatusIndex = lastStatusIndex + 1;
      next_status = AGRI_HEALTHCARE_STATUS[nextStatusIndex];
    }
  }
  scenario = scenario?scenario:next_status;
  
  const responseMessage: any = {
    order: {
      id: message.order.id,
      status: "In-progress",
      provider: {
        ...message.order.provider,
        rateable: undefined,
      },
      items: message.order.items,
      billing: { ...message.order.billing, tax_id: undefined },

      fulfillments: message.order.fulfillments.map(
        (fulfillment: Fulfillment) => ({
          ...fulfillment,
          id: fulfillment.id,
          state: {
            descriptor: {
              code: "AT_LOCATION",
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
      quote: message.order.quote,
      payments: message.order.payments,
      documents: [
        {
          url: "https://invoice_url",
          label: "INVOICE",
        },
      ],
      created_at: message.order.created_at,
      updated_at: message.order.updated_at,
    },
  };

  switch (scenario) {
    case "IN_TRANSIT":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "IN_TRANSIT";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
      });
      break;
    case "AT_LOCATION":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization
            ? (stop.authorization = { ...stop.authorization, status: "valid" })
            : undefined
        );
      });
      break;
    case "COLLECTED_BY_AGENT":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "COLLECTED_BY_AGENT";
      });
      break;
    case "RECEIVED_AT_LAB":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "RECEIVED_AT_LAB";
      });
      break;
    case "TEST_COMPLETED":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "TEST_COMPLETED";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
      });
      break;
    case "REPORT_GENERATED":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "REPORT_GENERATED";
      });
      break;
    case "REPORT_SHARED":
      responseMessage.order.status = "Completed"
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "REPORT_SHARED";
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
    `${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_STATUS : `/${ON_ACTION_KEY.ON_STATUS}`
    }`,
    `${ON_ACTION_KEY.ON_STATUS}`,
    "agri-services"
  );
}catch(error){
  next(error)
}
};







