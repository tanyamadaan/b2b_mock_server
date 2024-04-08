import { Request, Response } from "express";
import {
  MOCKSERVER_ID,
  SERVICES_BAP_MOCKSERVER_URL,
  checkIfCustomized,
  createAuthHeader,
  logger,
  redis,
} from "../../../lib/utils";
import axios from "axios";

export const initiateSelectController = async (req: Request, res: Response) => {
  const { scenario, transactionId } = req.body;

  const transactionKeys = await redis.keys(`${transactionId}-*`);
  const ifTransactionExist = transactionKeys.filter((e) => e.includes('on_search-to-server'))

  if (ifTransactionExist.length > 0) {
    return res.status(400).json({
      message: {
        ack: {
          status: "NACK",
        },
      },
      error: {
        message: "On search doesn't exist",
      },
    });
  }
  const transaction = await redis.mget(ifTransactionExist)
  const parsedTransaction = transaction.map(((ele) => {
    return JSON.parse(ele as string)
  }))

  console.log('parsedTransaction:::: ', parsedTransaction[0])
  return intializeRequest(req, res, parsedTransaction[0], scenario)
};

const intializeRequest = async (req: Request, res: Response, transaction: any, scenario: string) => {
  const { context, message: { fulfillments, payments, providers } } = transaction;
  const { transaction_id } = context.transaction_id
  const { id, locations, ...remainingProviders } = providers[0]
  const { id: parent_item_id, location_ids, ...item } = providers[0].items[0]
  let items = []

  const customized = checkIfCustomized(providers[0].items)

  if (customized) {
    items = [
      { parent_item_id, location_ids },
      ...providers[0].items.slice(1).map((item: any) => {
        return {
          id: item.id,
          parent_item_id,
          quantity: {
            "selected": {
              "count": 3
            }
          },
          category_ids: item.category_ids,
          tags: item.tags
        }
      })
    ]
  } else {
    items = providers[0].items = [providers[0]?.items.map(({ id, parent_item_id, location_ids }:
      { id: any, parent_item_id: any, location_ids: any }) => ({ id, parent_item_id, location_ids: [{ id: location_ids[0] }] }))[0]]
  }

  const select = {
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      action: 'select',
      bap_id: MOCKSERVER_ID,
      bap_uri: SERVICES_BAP_MOCKSERVER_URL,
    },
    order: {
      provider: {
        id,
        locations: [{
          id: locations[0]?.id
        }],
      },
      items,
      fulfillments: [
        {
          type: fulfillments[0].type,
          stops: [
            {
              "type": "end",
              "location":
              {
                "gps": "12.974002,77.613458",
                "area_code": "560001"
              },
              "time": {
                "label": "selected",
                "range": { // should be dynamic on the basis of scehdule
                  "start": providers[0].time.schedule.times[0],
                  "end": providers[0].time.schedule.times[1]
                }
              },
              "days": (customized) ? fulfillments[0].days.split(',')[0] : undefined
            }
          ]
        }
      ],
      payments: [{ type: payments[0].type }]
    }
  };

  const header = await createAuthHeader(select);
  try {
    await redis.set(
      `${transaction_id}-select-from-server`,
      JSON.stringify({ request: { ...select } })
    );
    await axios.post(`${context.bpp_uri}/select`, select, {
      headers: {
        "X-Gateway-Authorization": header,
        authorization: header,
      },
    });

    return res.json({
      message: {
        ack: {
          status: "ACK",
        },
      },
      transaction_id,
    });
  } catch (error) {
    logger.error({ type: "response", message: error });
    return res.json({
      message: {
        ack: {
          status: "NACK",
        },
      },
      error: {
        // message: (error as any).message,
        message: "Error Occurred while pinging NP at BPP URI",
      },
    });
  }
}