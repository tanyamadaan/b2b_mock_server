import * as _ from "lodash";
import { useState } from "react";
import { NEXT_ACTION, SCENARIOS } from "../constants";

export const useAction = () => {
	const [action, setAction] = useState<string>();
	const [logError, setLogError] = useState(false);
	const [scenarios, setScenarios] = useState<{ name: string }[]>();

	const detectAction = _.debounce((log: string) => {
		try {
			const parsedLog = JSON.parse(log);
			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action;
			setAction(parsedAction);
			const scenarioKey = Object.keys(SCENARIOS).filter(
				(key) => key === NEXT_ACTION[parsedAction as keyof typeof NEXT_ACTION]
			)[0];
			if (scenarioKey) {
				setScenarios(SCENARIOS[scenarioKey as keyof typeof SCENARIOS]);
			}

			setLogError(false);
		} catch (error) {
			// console.log("Error Occurred in LOG", error);
			setLogError(true);
			setAction(undefined);
		}
	}, 2500);
	return { action, logError, scenarios, detectAction };
};
