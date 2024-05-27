import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import {agriSrvSchemaValidator} from "../lib/schema/agri-services"
type JsonSchemaValidatorType = {
	domain: "b2b" | "services" | "agri-services";
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
		| "on_cancel";
};
export const jsonSchemaValidator = ({
	domain,
	action,
}: JsonSchemaValidatorType) => {
	if (domain === "b2b") {
	return b2bSchemaValidator(action);
	} else if(domain === "services"){
		return srvSchemaValidator(action)
	}else{
		return agriSrvSchemaValidator(action)
	}
};
