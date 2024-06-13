import { NextFunction, Request, Response } from "express";
import { AGRI_SERVICES_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const searchController = (req: Request, res: Response, next: NextFunction) => {
 
  const file = fs.readFileSync(
    path.join(
      AGRI_SERVICES_EXAMPLES_PATH,
      `on_search/${
        "on_search.yaml"
      }`
    )
  ); 

  const response = YAML.parse(file.toString());

  console.log("bap uri",req.body.context.bap_uri)
  
  return responseBuilder(
    res,
    next,
    req.body.context,
    response.value.message,
    `${req.body.context.bap_uri}${
      req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
    }`,
    `on_search`,
    "agri-services"
  );
};
