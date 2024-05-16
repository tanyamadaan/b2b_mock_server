import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { set, eq } from "lodash";
import _ from "lodash";
import { isBefore, addDays } from "date-fns";
import {
  MOCKSERVER_ID,
  checkIfCustomized,
  send_response,
  send_nack,
  redisFetchToServer,
  HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
  HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
} from "../../../lib/utils";


export const initiateSelectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { transactionId } = req.body;
  const on_search = await redisFetchToServer("on_search", transactionId);
  if (!on_search) {
    send_nack(res, "On Search doesn't exist")
  }
  on_search.context.bpp_uri = HEALTHCARE_SERVICES_BPP_MOCKSERVER_URL
  let scenario = "selection";
  if (checkIfCustomized(on_search.message.catalog.providers[0].items)) {
    scenario = "customization";
  }
  const items = on_search.message.catalog.providers[0]?.categories;
  let child_ids;
  if (items) {
    // Need to validate it for healthcare
    const parent_id = items.find(
      (ele: any) => ele.descriptor.code === "MEAL"
    )?.id;
    child_ids = items.reduce((acc: string[], ele: any) => {
      if (ele.parent_category_id === parent_id) {
        acc.push(ele.id);
      }
      return acc;
    }, []);
  }
  req.body.child_ids = child_ids;
  return intializeRequest(req, res, next, on_search, scenario);
};

const intializeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  transaction: any,
  scenario: string
) => {
  const {
    context,
    message: {
      catalog: { fulfillments, payments, providers },
    },
  } = transaction;
  const { transaction_id } = context;
  const { id, locations } = providers[0];
  //   const { location_ids } = providers[0].items[0];
  let items = [];
  let start;
  let endDate;
  if (scenario === "customization") {
    const startDate = new Date(providers?.[0]?.time?.range?.start);

    const startCategory = providers?.[0]?.categories?.find((cat: any) => {
      return cat.id === req.body.child_ids[0];
    });
    const startSchedule = startCategory?.tags?.find(
      (ele: any) => ele.descriptor.code === "schedule"
    );
    const startTime = startSchedule?.list?.find(
      (ele: any) => ele.descriptor.code === "start_time"
    ).value;
    const hour = Number(startTime?.split(":")[0]);
    const minutes = Number(startTime?.split(":")[1]);

    start = new Date(startDate);
    start.setUTCHours(hour, minutes, 0, 0);

    const currentDate = new Date();

    // Compare the start date with the current date and time
    if (isBefore(start, currentDate)) {
      currentDate.setUTCHours(start.getUTCHours());
      currentDate.setUTCMinutes(start.getUTCMinutes());
      currentDate.setUTCSeconds(start.getUTCSeconds());
      start = addDays(currentDate, 1);
    }

    const scheduleobj = providers[0]?.categories
      .find((itm: any) => itm.id === req.body.child_ids[0])
      ?.tags.find((tag: any) => tag.descriptor.code === "schedule");

    const endDateFrequency = scheduleobj?.list.find(
      (ele: any) => ele.descriptor.code === "frequency"
    )?.value;

    const frequency = parseInt(endDateFrequency?.match(/\d+/)[0]);

    //end date
    endDate = new Date(start);
    endDate.setUTCHours(start.getUTCHours() + frequency);

    // getting the required categories ids to look  for
    const required_categories = processCategories(providers[0].categories);

    const count_cat: any = {};
    required_categories.forEach((cat: any) => {
      count_cat[cat] = 0;
    });

    //get the parent item in customization
    items = [...providers[0].items];
    const parent_item = items.find((itm: any) =>
      _.isEmpty(itm.parent_category_id)
    );

    // selecting elements based on categories selected
    items = items.filter((itm: any) => {
      let flag = 0;
      itm?.category_ids.forEach((id: string) => {
        if (id in count_cat && count_cat[id] < 1) {
          count_cat[id]++;
          flag = 1;
        }
      });
      if (flag === 1) {
        return true;
      }
      return false;
    });

    const { id: item_id, parent_item_id, location_ids } = parent_item;
    items = [
      {
        id: item_id,
        parent_item_id,
        location_ids,
        quantity: {
          selected: {
            count: 1,
          },
        },
      },
      ...items.map((item: any) => {
        return {
          // ...item,
          id: item.id,
          parent_item_id: item.parent_item_id,
          quantity: {
            selected: {
              count: 1,
            },
          },
          category_ids: item.category_ids,
          location_ids: [location_ids],
          tags: item.tags.map((tag: any) => ({
            ...tag,
            list: tag.list.map((itm2: any, index: any) => {
              if (index === 0) {
                return {
                  descriptor: {
                    code: "type",
                  },
                  value: "customization",
                };
              } else {
                return itm2; // Return the item unchanged if it's not the first element
              }
            }),
          })),
        };
      }),
    ];
  } else {
    items = providers[0].items = [
      providers[0]?.items.map(
        ({
          id,
          parent_item_id,
          location_ids,
          fulfillment_ids,
          tags
        }: {
          id: any;
          parent_item_id: any;
          location_ids: any;
          fulfillment_ids: any;
          tags: any
        }) =>
          ({ id, parent_item_id, location_ids: [{ id: location_ids[0] }], fulfillment_ids: { id: fulfillment_ids[0] }, tags: [tags[0]] })
      )[0],
    ];
  }

  const select = {
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      action: "select",
      bap_id: MOCKSERVER_ID,
      bap_uri: HEALTHCARE_SERVICES_BAP_MOCKSERVER_URL,
      message_id: uuidv4(),
    },
    message: {
      order: {
        provider: {
          id,
          locations: [
            {
              id: locations[0]?.id,
            },
          ],
        },
        items: items.map((itm) => {
          return {
            ...itm,
            location_ids: itm.location_ids
              ? itm.location_ids.map((id: any) => {
                return id?.id;
              })
              : undefined,
            fulfillment_ids: [itm.fulfillment_ids.id],
            quantity: {
              selected: {
                count: 1,
              },
            },
          };
        }),
        fulfillments: [
          {
            ...fulfillments[0],
            type: fulfillments[0].type,
            stops: [
              {
                type: "end",
                location: {
                  gps: "12.974002,77.613458",
                  area_code: "560001",
                },
                time: {
                  label: "selected",
                  range: {
                    // should be dynamic on the basis of schedule
                    start:
                      providers[0]?.time?.schedule?.times?.[0] ?? new Date(),
                    end: providers[0]?.time?.schedule?.times?.[1] ?? new Date(),
                  },
                },
                days: scenario === "customization" ? "4" : undefined,
              },
            ],
          },
        ],
      //   offers: [
      //   {
      //     id: providers[0]?.offers[0]?.id,
      //     tags: [
      //       {
      //         code: "SELECTION",
      //         list: [
      //           {
      //             code: "APPLY",
      //             value: "true"
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
        payments: [{ type: payments[0].type }],
      },

    },
  };
  if (eq(scenario, "customization")) {
    set(
      select,
      "message.order.fulfillments[0].stops[0].time.range.start",
      start
    );
    set(
      select,
      "message.order.fulfillments[0].stops[0].time.range.end",
      endDate
    );
  }

  await send_response(res, next, select, transaction_id, "select");
};

function processCategories(categories: Array<any>) {
  // sort the mandatory parent_ids
  const cat_ids: string[] = categories.reduce((acc: string[], itm: any) => {
    if (!("parent_category_id" in itm)) {
      const lis_selection = itm.tags?.find(
        (tag: any) => tag.descriptor?.code.toLowerCase() === "selection"
      );
      const mandatory = lis_selection?.list.find(
        (ele: any) => ele.descriptor.code === "mandatory_selection"
      )?.value;
      if (mandatory) {
        acc.push(itm.id);
      }
    }
    return acc;
  }, []);

  // sort the categories
  categories.forEach((cat: any) => {
    if ("parent_category_id" in cat) {
      if (cat_ids.includes(cat.parent_category_id)) {
        cat_ids.push(cat.id);
        if (cat_ids.indexOf(cat.parent_category_id) != -1) {
          cat_ids.splice(cat_ids.indexOf(cat.parent_category_id), 1);
        }
      }
    }
  });
  return cat_ids;
}
