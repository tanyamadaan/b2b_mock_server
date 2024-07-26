import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import { b2cSchemaValidator } from "../lib/schema/b2c";

type JsonSchemaValidatorType = {
	domain: "b2b" | "b2c" | "services";

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
	}else if(domain === "b2c"){
		return b2cSchemaValidator(action);
	}
	else if(domain === "services"){
		return srvSchemaValidator(action)
	}else{
		return srvSchemaValidator(action)
	}
};
