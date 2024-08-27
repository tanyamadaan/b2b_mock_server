import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import { subscriptionSchemaValidator } from "../lib/schema/subscription";
import { b2cSchemaValidator } from "../lib/schema/b2c";
import { retailSchemaValidator } from "../lib/schema/retail";

type JsonSchemaValidatorType = {
	domain: "b2b" | "b2c" | "services" | "retail" | "subscription";

	action:
		| "search"
		| "on_search"
		| "select"
		| "on_select"
		| "init"
		| "on_init"
		| "confirm"
		| "on_confirm"
		| "status"
		| "on_status"
		| "update"
		| "on_update"
		| "track"
		| "on_track"
		| "cancel"
		| "on_cancel"
		| "rating";
};

export const jsonSchemaValidator = ({
	domain,
	action,
}: JsonSchemaValidatorType) => {
	if (domain === "b2b") {
		return b2bSchemaValidator(action);
	} else if (domain === "b2c") {
		return b2cSchemaValidator(action);
	} else if (domain === "services") {
		return srvSchemaValidator(action);
	} else if (domain === "retail") {
		return retailSchemaValidator(action);
	} else if (domain === "subscription"){
		console.log("domainnnnnnnnnn")
		return subscriptionSchemaValidator(action);
	} else {
		return srvSchemaValidator(action);
	}
};
