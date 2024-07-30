import * as _ from "lodash";
import { useState } from "react";
import {
	B2B_SCENARIOS,
	SERVICES_SCENARIOS,
	NEXT_ACTION,
	HEALTHCARE_SERVICES_SCENARIOS,
	AGRI_SERVICES_SCENARIOS,
	B2C_SCENARIOS,
	AGRI_EQUIPMENT_SERVICES_SCENARIOS,
  LOGISTICS_SCENARIOS,
  NEXT_ACTION_LOGISTICS,
} from "openapi-specs/constants";

export const useAction = (domain: string) => {
	const [action, setAction] = useState<string>();
	const [logError, setLogError] = useState(false);
	
	const [scenarios, setScenarios] =
		useState<{ name: string; scenario?: string }[]>();

	const allScenarios =
		domain.toLowerCase() === "b2b"
			? B2B_SCENARIOS
			: domain.toLowerCase() === "b2c"
				? B2C_SCENARIOS
      : domain.toLowerCase() === "logistics"
      ? LOGISTICS_SCENARIOS
			: domain.toLowerCase() === "services"
			? SERVICES_SCENARIOS
			: domain.toLowerCase() === "healthcare-services"
			? HEALTHCARE_SERVICES_SCENARIOS
			: domain.toLowerCase() === "agri-equipment-hiring"?AGRI_EQUIPMENT_SERVICES_SCENARIOS:
			 AGRI_SERVICES_SCENARIOS;

	const detectAction = _.debounce((log: string) => {
		try {
			const parsedLog = JSON.parse(log);

			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action;
			setAction(parsedAction);
        // Choose the appropriate action mapping based on the domain
        const actionMapping =
        domain.toLowerCase() === "logistics" ? NEXT_ACTION_LOGISTICS : NEXT_ACTION;
        const scenarioKey = Object.keys(allScenarios).find(
          (key) => key === actionMapping[parsedAction as keyof typeof actionMapping]
        );
			if (scenarioKey) {
				setScenarios(allScenarios[scenarioKey as keyof typeof allScenarios]);
			} else {
				setScenarios([]);
			}
			setLogError(false);
		} catch (error) {
			// console.log("Error Occurred in LOG", error);
			setLogError(true);
			setAction(undefined);
		}
	}, 1500);
	return { action, logError, scenarios, detectAction };
};
