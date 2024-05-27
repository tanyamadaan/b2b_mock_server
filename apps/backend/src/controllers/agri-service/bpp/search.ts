import { NextFunction, Request, Response } from "express";
import { AGRI_SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const searchController = (req: Request, res: Response, next: NextFunction) => {
  const {
    message: { intent },
  } = req.body;

  console.log("req.bodydddddddddddddd",req.body)
  console.log("intent=>>>>>>>>>>",intent)
  const id = intent?.category?.id

  console.log("agri category id:",id)
  // uncomment for default selection of customization response
  // const id = "SRV11-1041";
  const file = fs.readFileSync(
    path.join(
      AGRI_SERVICES_EXAMPLES_PATH,
      `on_search/${
        id === "SRV14" ? "on_search_delivered.yaml" : "on_search.yaml"
      }`
    )
  );

  console.log("fileeeeeeeeeee",path.join(
    AGRI_SERVICES_EXAMPLES_PATH,
    `on_search/${
      id === "SRV14" ? "on_search_customized.yaml" : "on_search.yaml"
    }`
  ))

  const response = YAML.parse(file.toString());
  return responseBuilder(
    res,
    next,
    req.body.context,
    response.value.message,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
    }`,
    `on_search`,
    "services"
  );
};
