import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import { agriSrvSchemaValidator } from "../lib/schema/agri-services";
import { healthcareSrvSchemaValidator } from "../lib/schema/healthcare-services";
import { logisticsSchemaValidator } from "../lib/schema/logistics";
import { agriEquipmentHiringSchemaValidator } from "../lib/schema/agri-equipment-hiring";
import { b2cSchemaValidator } from "../lib/schema/b2c";


type AllActions =
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

type LogisticsActions = Exclude<AllActions, "select" | "on_select">;

type Domain = "b2b" |"b2c"| "services" | "agri-services" | "healthcare-service" | "logistics" |"agri-equipment-hiring";

type ActionType<T extends Domain> = T extends "logistics" ? LogisticsActions : AllActions;

type JsonSchemaValidatorType<T extends Domain> = {
  domain: T;
  action: ActionType<T>;
};

export const jsonSchemaValidator = <T extends Domain>({
  domain,
  action,
}: JsonSchemaValidatorType<T>) => {
  switch (domain) {
    case "b2b":
      return b2bSchemaValidator(action as AllActions);
		case "b2c":
			return b2cSchemaValidator(action as AllActions);
    case "services":
      return srvSchemaValidator(action as AllActions);
    case "agri-services":
      return agriSrvSchemaValidator(action as AllActions);
    case "logistics":
      return logisticsSchemaValidator(action as LogisticsActions);
    case "healthcare-service":
      return healthcareSrvSchemaValidator(action as AllActions);
		case "agri-equipment-hiring":
			return agriEquipmentHiringSchemaValidator(action as AllActions)
    default:
      throw new Error(`Unsupported domain: ${domain}`);
  }
};