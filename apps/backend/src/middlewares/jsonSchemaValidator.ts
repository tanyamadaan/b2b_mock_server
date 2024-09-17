import { b2bSchemaValidator } from "../lib/schema/b2b";
import { srvSchemaValidator } from "../lib/schema/services";
import { b2cSchemaValidator } from "../lib/schema/b2c";
import { retailSchemaValidator } from "../lib/schema/retail";
import { logisticsSchemaValidator } from "../lib/schema/logistics";

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

// Exclude "select", "on_select", and "rating" for logistics domain
type LogisticsActions = Exclude<AllActions, "select" | "on_select" | "rating">;

type Domain = "b2b" | "b2c" | "services" | "retail" | "logistics";

// Conditional type to handle logistics-specific actions
type ActionType<T extends Domain> = T extends "logistics" ? LogisticsActions : AllActions;

type JsonSchemaValidatorType<T extends Domain> = {
  domain: T;
  action: ActionType<T>;
};

export const jsonSchemaValidator = <T extends Domain>({
  domain,
  action,
}: JsonSchemaValidatorType<T>) => {
  if (domain === "b2b") {
    return b2bSchemaValidator(action as AllActions);
  } else if (domain === "b2c") {
    return b2cSchemaValidator(action as AllActions);
  } else if (domain === "retail") {
    return retailSchemaValidator(action as AllActions);
  } else if (domain === "logistics") {
    return logisticsSchemaValidator(action as LogisticsActions);
  }  else {
    return srvSchemaValidator(action as AllActions);
  }
};
