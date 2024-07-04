import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";


export const searchController = (req: Request, res: Response, next: NextFunction) => {
  try{
    const { message: { intent } } = req.body;
    const file = fs.readFileSync(
      path.join(
        AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
        `${ON_ACTION_KEY.ON_SEARCH}/${ON_ACTION_KEY.ON_SEARCH}.yaml}`
      )
    );
    console.log("Pathhhhhhhh",path.join(
      AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
      `${ON_ACTION_KEY.ON_SEARCH}/${ON_ACTION_KEY.ON_SEARCH}.yaml}`
    ))
    const response = YAML.parse(file.toString());
    return responseBuilder(
      res,
      next,
      req.body.context,
      response.value.message,
      `${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? ON_ACTION_KEY.ON_SEARCH : `/${ON_ACTION_KEY.ON_SEARCH}`
      }`,
      `${ON_ACTION_KEY.ON_SEARCH}`,
      "agri-equipment-hiring"
    );
  }catch(error){
    return next(error)
  }
};
