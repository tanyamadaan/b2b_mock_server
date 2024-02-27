const yaml = require("js-yaml");
const fs = require("fs");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const { execSync } = require("child_process");
const path = require("path");
const { ACTIONS, B2B_SCENARIOS, SERVICES_SCENARIOS } = require("./constants");

const swaggerParse = async (swaggerPath) => {
	const file = fs.readFileSync(swaggerPath, "utf8");
	const swaggerDocument = yaml.load(file);
	try {
		// console.log("Swagger Doc", swaggerDocument);
		let schema = await $RefParser.dereference(swaggerDocument);
		// console.log("SCHEMA", schema);
		return schema;
	} catch (err) {
		console.error(err);
	}
};

const generateSwagger = async (
	inputPath,
	outputPath,
	scenarios = {},
	servers = []
) => {
	const schema = await swaggerParse(inputPath);
	var exampleSet = schema["x-examples"][Object.keys(schema["x-examples"])[0]];

	schema["info"]["title"] = exampleSet["summary"];
	schema["info"]["description"] = exampleSet["description"];
	exampleSet = exampleSet["example_set"];

	if (servers.length > 0) {
		schema.servers = servers;
	}
	for (i of Object.keys(schema.paths)) {
		const key = i.replace("/", "");
		schema.paths[i].post.parameters = [
			{
				in: "query",
				name: "mode",
				required: true,
				schema: {
					type: "string",
					enum: ["sandbox", "mock"],
				},
			},
		];

		if (scenarios[ACTIONS.next[key]]) {
			schema.paths[i].post.parameters.push({
				in: "query",
				name: "scenario",
				required: true,
				schema: {
					type: "string",
					enum: scenarios[ACTIONS.next[key]].map((each) => each.scenario),
				},
			});
		}
		if (exampleSet[key]) {
			// console.log("key", key);
			schema.paths[i].post.requestBody.content["application/json"].examples =
				exampleSet[key].examples;
		}
	}
	// console.log("SCHEMA", schema);
	const build = yaml.dump(schema);
	fs.writeFileSync(path.join(outputPath, "openapi-temp.yaml"), build, "utf8");
	const command = `npx swagger-cli bundle ${path.join(
		outputPath,
		"openapi-temp.yaml"
	)} --outfile ${path.join(outputPath, "build", "swagger.yaml")} -t yaml`;
	execSync(command, { stdio: "inherit" });
	fs.unlinkSync(path.join(outputPath, "openapi-temp.yaml"));
};

generateSwagger(
	"./domain-repos/@retail-b2b/2.0.2/api/build/build.yaml",
	"./src/openapi/retail-b2b",
	B2B_SCENARIOS,
	[
		{ url: "/api/b2b/bpp", description: "Provider Platform" },
		{ url: "/api/b2b/bap", description: "Customer Platform" },
	]
);

generateSwagger(
	"./domain-repos/@services/draft-services/api/build/build.yaml",
	"./src/openapi/services",
	SERVICES_SCENARIOS,
	[
		{ url: "/api/services/bpp", description: "Provider Platform" },
		{ url: "/api/services/bap", description: "Customer Platform" },
	]
)
