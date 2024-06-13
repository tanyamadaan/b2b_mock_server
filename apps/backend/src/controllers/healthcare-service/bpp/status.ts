
import { NextFunction, Request, Response } from "express";

import {
  Fulfillment,
  Stop,
  redisExistFromServer,
  redisFetchFromServer,
  responseBuilder,
  send_nack,
} from "../../../lib/utils";
export const statusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let scenario: string = String(req.query.scenario) || "";
  const { transaction_id } = req.body.context;

  const on_confirm_data = await redisFetchFromServer(
    "on_confirm",
    transaction_id
  ); //from
  if (!on_confirm_data) {
    return send_nack(res, "on confirm doesn't exist");
  }

  const on_cancel_exist = await redisExistFromServer(
    "on_cancel",
    transaction_id
  );
  if (on_cancel_exist) {
    scenario = "cancel";
  }
  console.log("Senario ---", scenario);

  return statusRequest(req, res, next, on_confirm_data, scenario);
};
const statusRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  const { context, message } = transaction;
  // modifying context
  context.action = "on_status";
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
              code: "At-Location",
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
    case "in-transit":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "In-Transit";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
      });
      break;
    case "reached":
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization
            ? (stop.authorization = { ...stop.authorization, status: "valid" })
            : undefined
        );
      });
      break;
    case "completed":
      console.log("come in completed")
      responseMessage.order.status = "Completed";
      responseMessage.order.fulfillments.forEach((fulfillment: Fulfillment) => {
        fulfillment.state.descriptor.code = "Completed";
        fulfillment.stops.forEach((stop: Stop) =>
          stop?.authorization ? (stop.authorization = undefined) : undefined
        );
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
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_status" : "/on_status"
    }`,
    `on_status`,
    "healthcare-service"
  );
};

// let statusQueue: string[] = []; // Queue to hold URLs

// // Function to check the status of a single API
// async function checkStatus(data: any, url: any) {
// 	try {
// 		const { context, message, on_confirm } = data;
// 		const file = fs.readFileSync(
// 			path.join(HEALTHCARE_SERVICES_EXAMPLES_PATH, url)
// 		);
// 		const response = YAML.parse(file.toString());
// 		const timestamp = new Date().toISOString();

// 		const constYamlStatus = response.value.message.order.status;
// 		const status = {
// 			context: {
// 				...context,
// 				timestamp: new Date().toISOString(),
// 				action: "on_status",
// 				bap_id: MOCKSERVER_ID,
// 				bap_uri: HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
// 				message_id: uuidv4()
// 			},
// 			message: {
// 				order: {
// 					...response.value.message.order,
// 					id: on_confirm.message.order.id,
// 					status: response.value.message.order.status,
// 					provider: on_confirm.message.order.provider,
// 					items: on_confirm.message.order.items,
// 					fulfillments: response.value.message.order.fulfillments,
// 					quote: on_confirm.message.order.quote,
// 					payments: [
// 						{
// 							...on_confirm.message.order.payments[0],
// 							params: {
// 								...on_confirm.message.order.payments[0].params,
// 								transaction_id: uuidv4(),
// 							},
// 							status: "PAID",
// 						},
// 					],
// 					document: response.value.message.order.document,
// 					created_at: timestamp,
// 					updated_at: timestamp,
// 				},
// 			},
// 		};
// 		console.log("urllllllllll",url,)
// 		return status;
// 	} catch (error) {
// 		console.error(`Error fetching constYamlStatus from:`, error);
// 		throw error;
// 	}
// }

// // Function to process the next URL in the queue
// async function processNextUrl(req: Request, res: Response, next: NextFunction) {
// 	const url = statusQueue.shift(); // Get the next URL from the queue
// 	if (!url) {
// 		// If there are no more URLs in the queue, call next() to move to the next middleware
// 		next();
// 		return;
// 	}

// 	try {
// 		const status = await checkStatus(req.body, url);
// 		res.json(status); // Send the response for this URL
// 	} catch (error) {
// 		console.error("Error processing URL:", url, error);
// 		res.status(500).json({ error: "An error occurred while processing the request" });
// 	}
// }

// // Automatically triggered status with 30 seconds gap
// const automatTrigStatusWith30SecInterval = async (req: Request, res: Response, next: NextFunction) => {
// 	const { context, message, on_confirm } = req.body;

// 	// List of status API URLs
// 	const statusApiUrls = [
// 		"on_status/on_status_transit.yaml",
// 		"on_status/on_status_at_location.yaml",
// 		"on_status/on_status_collected_by_agent.yaml",
// 		"on_status/on_status_received_at_lab.yaml",
// 		"on_status/on_status_test_completed.yaml",
// 		"on_status/on_status_report_generated.yaml",
// 		"on_status/on_status_report_shared.yaml"
// 	];

// 	// Add URLs to the queue
// 	statusApiUrls.forEach((url) => {
// 		statusQueue.push(url);
// 	});

// 	// Process the queue
// 	processNextUrl(req, res, next);
// };

