import path from "path";
import YAML from "yaml";
import fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { JsonObject } from "swagger-ui-express";

import swaggerUi from "swagger-ui-express";
export const swaggerParse = async (swaggerPath: string) => {
	const file = fs.readFileSync(
		swaggerPath,
		"utf8"
	);
	const swaggerDocument = YAML.parse(file);
  try {
    let schema = await $RefParser.dereference(swaggerDocument);
    console.log("SCHEMA", schema);
    return schema as JsonObject
  }
  catch(err) {
    console.error(err);
  }
};

export const swaggerHandler = async () => {
	const parsedSwagger = await swaggerParse("./src/openapi/build/swagger.yaml");
	return swaggerUi.setup(parsedSwagger);
}