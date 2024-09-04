import * as _ from "lodash";
import { useState } from "react";
import {
	B2B_SCENARIOS,
	SERVICES_SCENARIOS,
	NEXT_ACTION,
	HEALTHCARE_SERVICES_SCENARIOS,
	AGRI_SERVICES_SCENARIOS,
	AGRI_EQUIPMENT_SERVICES_SCENARIOS,
	BID_AUCTION_SCENARIOS,
} from "openapi-specs/constants";
import { SERVICES_DOMAINS } from "../constants";
// import { ALL_DOMAINS_FRONTEND } from "../constants";

export const useAction = () => {
	const [action, setAction] = useState<string>();
	const [domain, setDomain] = useState<string>("");
	const [logError, setLogError] = useState(false);

	const [scenarios, setScenarios] =
		useState<{ name: string; scenario?: string }[]>();

	const detectAction = _.debounce((log: string, version?: string) => {
		try {
			const parsedLog = JSON.parse(log);
			//DETACT DOMAIN FROM PAYLOAD
			const servicesDomain = parsedLog?.context?.domain;
			//DETACT DOMAIN
			const allScenarios =
				servicesDomain === SERVICES_DOMAINS.SERVICE
					? SERVICES_SCENARIOS
					: servicesDomain === SERVICES_DOMAINS.HEALTHCARE_SERVICES
					? HEALTHCARE_SERVICES_SCENARIOS
					: servicesDomain === SERVICES_DOMAINS.AGRI_SERVICES
					? AGRI_SERVICES_SCENARIOS
					: servicesDomain === SERVICES_DOMAINS.EQUIPMENT_HIRING_SERVICES
					? AGRI_EQUIPMENT_SERVICES_SCENARIOS
					: servicesDomain === SERVICES_DOMAINS.BID_AUCTION_SERVICE
					? BID_AUCTION_SCENARIOS
					: version === "b2b"
					? B2B_SCENARIOS
					: B2C_SCENARIOS;

			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action;
			setAction(parsedAction);
			const scenarioKey = Object.keys(allScenarios).filter(
				(key) => key === NEXT_ACTION[parsedAction as keyof typeof NEXT_ACTION]
			)[0];

			if (scenarioKey) {
				setScenarios(allScenarios[scenarioKey as keyof typeof allScenarios]);
			} else {
				setScenarios([]);
			}

			setLogError(false);
		} catch (error) {
			setLogError(true);
			setAction(undefined);
		}
	}, 1500);
	return { action, domain, setDomain, logError, scenarios, detectAction };
};
