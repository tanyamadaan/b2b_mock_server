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
	BID_AUCTION_SCENARIOS,
	LOGISTICS_SCENARIOS,
	NEXT_ACTION_LOGISTICS,
} from "openapi-specs/constants";
import {
	LOGISTICS_DOMAINS_OBJECT,
	SERVICE_DOMAINS,
	SERVICES_DOMAINS,
} from "../constants";
// import { ALL_DOMAINS_FRONTEND } from "../constants";

export const useAction = () => {
	const [action, setAction] = useState<string>();
	const [domain, setDomain] = useState<string>("");
	const [logError, setLogError] = useState(false);

	const [scenarios, setScenarios] =
		useState<{ name: string; scenario?: string }[]>();

	const detectAction = _.debounce((log: string) => {
		try {
			const parsedLog = JSON.parse(log);
			// const newDomain =
			// 	parsedLog?.context?.domain === ALL_DOMAINS_FRONTEND.SERVICES_DOMAINS
			// 		? "services"
			// 		: parsedLog?.context?.domain ===
			// 		  ALL_DOMAINS_FRONTEND.HEALTHCARE_SERVICES_DOMAINS
			// 		? "healthcare-services"
			// 		: parsedLog?.context?.domain ===
			// 		  ALL_DOMAINS_FRONTEND.AGRI_SERVICES_DOMAINS
			// 		? "agri-services"
			// 		: "b2b";

			// setDomain(newDomain);

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
					: servicesDomain === LOGISTICS_DOMAINS_OBJECT.DOMESTIC ||
					  servicesDomain === LOGISTICS_DOMAINS_OBJECT.INTERNATIONAL
					? LOGISTICS_SCENARIOS
					: B2B_SCENARIOS;
			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action;
			setAction(parsedAction);
			// Choose the appropriate action mapping based on the domain
			const actionMapping =
				domain.toLowerCase() === "logistics"
					? NEXT_ACTION_LOGISTICS
					: NEXT_ACTION;
			const scenarioKey = Object.keys(allScenarios).find(
				(key) =>
					key === actionMapping[parsedAction as keyof typeof actionMapping]
			);
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
