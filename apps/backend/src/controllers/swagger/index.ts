import YAML from "yaml";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";


const authFile = fs.readFileSync(
	path.join(__dirname, "../../openapi/auth/openapi.yaml"),
	"utf8"
);
const authSwaggerDocument = YAML.parse(authFile);
export const authSwagger = swaggerUi.setup(authSwaggerDocument)

const servicesFile = fs.readFileSync(
	path.join(__dirname, "../../openapi/services/build/swagger.yaml"),
	"utf8"
);
const servicesSwaggerDocument = YAML.parse(servicesFile);
export const servicesSwagger = swaggerUi.setup(servicesSwaggerDocument)

const b2bFile = fs.readFileSync(
	path.join(__dirname, "../../openapi/retail-b2b/build/swagger.yaml"),
	"utf8"
);
const b2bSwaggerDocument = YAML.parse(b2bFile);
export const b2bSwagger = swaggerUi.setup(b2bSwaggerDocument)