import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import {agriSrvSchemaValidator} from "../lib/schema/agri-services"
import {healthcareSrvSchemaValidator} from "../lib/schema/healthcare-services"
import { agriEquipmentHiringSchemaValidator } from "../lib/schema/agri-equipment-hiring";
import { b2cSchemaValidator } from "../lib/schema/b2c";


type JsonSchemaValidatorType = {
	domain: "b2b" | "b2c" | "services" | "agri-services" | "healthcare-service" | "agri-equipment-hiring";

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
	}else if(domain === "agri-services"){
		return agriSrvSchemaValidator(action)
	}else if(domain === "healthcare-service"){
		return healthcareSrvSchemaValidator(action)
	}else{
		return agriEquipmentHiringSchemaValidator(action)
	}
};
