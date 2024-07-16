import { NextFunction, Request, Response } from "express";
import {
  B2B_BAP_MOCKSERVER_URL,
  B2B_EXAMPLES_PATH,
  MOCKSERVER_ID,
  send_response,
  createAuthHeader,
  logger,
  redis,
  B2C_EXAMPLES_PATH,
  B2C_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";
import axios from "axios";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateSearchController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bpp_uri, city, domain } = req.body;
    var file = fs.readFileSync(
      path.join(B2C_EXAMPLES_PATH, "search/search_by_item.yaml")
    );
    var search = YAML.parse(file.toString());
    search = search.value;
    const transaction_id = uuidv4();
    search = {
      ...search,
      context: {
        ...search.context,
        timestamp: new Date().toISOString(),
        location: {
          ...search.context.location,
          city: {
            code: city,
          },
        },
        transaction_id,
        message_id: uuidv4(),
        domain,
        bap_id: MOCKSERVER_ID,
        bap_uri: B2C_BAP_MOCKSERVER_URL,
      },
    };
    search.bpp_uri = bpp_uri;
    await send_response(res, next, search, transaction_id, "search");
  } catch (error) {
    return next(error);
  }
};
