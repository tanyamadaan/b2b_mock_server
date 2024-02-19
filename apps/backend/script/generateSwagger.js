const yaml = require("js-yaml");
const fs = require("fs");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const { execSync } = require("child_process");

const swaggerParse = async (swaggerPath) => {
	const file = fs.readFileSync(swaggerPath, "utf8");
	const swaggerDocument = yaml.load(file);
	try {
		console.log("Swagger Doc", swaggerDocument);
		let schema = await $RefParser.dereference(swaggerDocument);
		console.log("SCHEMA", schema);
		return schema;
	} catch (err) {
		console.error(err);
	}
};

const generateSwagger = async () => {
	const schema = await swaggerParse("./src/openapi/openapi.yaml");
	console.log("SCHEMA", schema);
	const build = yaml.dump(schema);
	fs.writeFileSync("./src/openapi/openapi-temp.yaml", build, "utf8");
	const command = `npx swagger-cli bundle ./src/openapi/openapi-temp.yaml --outfile ./src/openapi/build/swagger.yaml -t yaml`;
	execSync(command, { stdio: "inherit" });
  fs.unlinkSync("./src/openapi/openapi-temp.yaml")
};

generateSwagger();
