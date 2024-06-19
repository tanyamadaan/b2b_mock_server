import { NextFunction, Request, Response } from "express";
import {
  SERVICES_BAP_MOCKSERVER_URL,
  MOCKSERVER_ID,
  send_response,
  send_nack,
  redisFetchToServer,
  checkIfCustomized,
  createAuthHeader,
  logger,
  redis,
} from "../../../lib/utils";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const senarios: string[] = [
  "service-started",
  "in-transit",
  "reached",
  "completed",
];
export const initiateStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId } = req.body;
    const transactionKeys = await redis.keys(`${transactionId}-*`);
    const on_confirm = await redisFetchToServer("on_confirm", transactionId);
    if (!on_confirm) {
      return send_nack(res, "On Confirm doesn't exist");
    }
    const statusIndex = transactionKeys.filter((e) =>
      e.includes("-status-to-server")
    ).length;
    return intializeRequest(res, next, on_confirm, statusIndex);
  } catch (error) {
    return next(error);
  }
};

const intializeRequest = async (
  res: Response,
  next: NextFunction,
  transaction: any,
  statusIndex: number
) => {
  try {
    const { context } = transaction;
    const { transaction_id } = context;

    const status = {
      context: {
        ...context,
        message_id: uuidv4(),
        timestamp: new Date().toISOString(),
        action: "status",
        bap_id: MOCKSERVER_ID,
        bap_uri: SERVICES_BAP_MOCKSERVER_URL,
      },
      message: {
        order_id: transaction?.message?.order?.id,
      },
    };
    // satus index is always witin boundary of senarios array
    statusIndex = Math.min(Math.max(statusIndex, 0), senarios.length - 1);
    // console.log("Status:::", statusIndex);
    await send_response(
      res,
      next,
      status,
      transaction_id,
      "status",
      senarios[statusIndex]
    );
    // const header = await createAuthHeader(status);
    // try {
    // 	await redis.set(
    // 		`${transaction_id}-${statusIndex}-status-from-server`,
    // 		JSON.stringify({ request: { ...status } })
    // 	);
    // 	const response = await axios.post(`${context.bpp_uri}/status`, status, {
    // 		headers: {
    // 			// "X-Gateway-Authorization": header,
    // 			authorization: header,
    // 		},
    // 	});

    // 	await redis.set(
    // 		`${transaction_id}-${statusIndex}-status-from-server`,
    // 		JSON.stringify({
    // 			request: { ...status },
    // 			response: {
    // 				response: response.data,
    // 				timestamp: new Date().toISOString(),
    // 			},
    // 		})
    // 	);

    // 	return res.json({
    // 		message: {
    // 			ack: {
    // 				status: "ACK",
    // 			},
    // 		},
    // 		transaction_id,
    // 	});
    // } catch (error) {
    // 	return next(error);
    // }
  } catch (error) {
    return next(error);
  }
};
