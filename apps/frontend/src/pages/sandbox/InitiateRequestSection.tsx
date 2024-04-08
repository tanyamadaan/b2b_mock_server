/* eslint-disable no-mixed-spaces-and-tabs */
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { B2B_DOMAINS, checker, CITY_CODE, SERVICES_DOMAINS } from "../../utils";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { Input, Option, Select, Button } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
import { B2B_SCENARIOS, SERVICES_SCENARIOS } from "openapi-specs/constants";
import Divider from "@mui/material/Divider";
import { Grow } from "@mui/material";
import { useMessage } from "../../utils/hooks";

type InitiateRequestSectionProp = {
	domain: "b2b" | "services";
};

const FIELDS = {
	search: [
		{
			name: "bpp_uri",
			placeholder: "Enter Your BPP URI",
			type: "text",
		},
		{
			name: "domain",
			placeholder: "Select domain...",
			type: "select",
			domainDepended: true,
			options: {
				b2b: B2B_DOMAINS,
				services: SERVICES_DOMAINS,
			},
		},
		{
			name: "city",
			placeholder: "Select A City",
			type: "select",
			domainDepended: false,
			options: CITY_CODE,
		},
	],
	select: [
		{
			name: "transactionId",
			placeholder: "Enter Your Transaction ID",
			type: "text",
		},
		{
			name: "scenario",
			placeholder: "Select Scenario",
			type: "select",
			domainDepended: true,
			options: {
				b2b: B2B_SCENARIOS["select"].map((each) => each.scenario),
				services: SERVICES_SCENARIOS["select"].map((each) => each.scenario),
			},
		},
	],
	init: [
		{
			name: "transactionId",
			placeholder: "Enter Your Transaction ID",
			type: "text",
		},
		{
			name: "scenario",
			placeholder: "Select Scenario",
			type: "select",
			domainDepended: true,
			options: {
				b2b: B2B_SCENARIOS["init"].map((each) => each.scenario),
				services: SERVICES_SCENARIOS["init"].map((each) => each.scenario),
			},
		},
	],
	confirm: [
		{
			name: "transactionId",
			placeholder: "Enter Your Transaction ID",
			type: "text",
		},
		{
			name: "scenario",
			placeholder: "Select Scenario",
			type: "select",
			domainDepended: true,
			options: {
				services: SERVICES_SCENARIOS["confirm"].map((each) => each.scenario),
			},
		},
	],
};

type SELECT_OPTIONS =
	| string[]
	| { b2b: string[]; services: string[] }
	| { b2b: string[]; services: string[] }
	| { services: string[] };

export const InitiateRequestSection = ({
	domain,
}: InitiateRequestSectionProp) => {
	const {handleMessageToggle} = useMessage();
	const [action, setAction] = useState<string>();
	const [renderActionFields, setRenderActionFields] = useState(false);
	const [formState, setFormState] = useState<object>();
	const [allowSubmission, setAllowSubmission] = useState<boolean>();

	const handleActionSelection = (
		_event: React.SyntheticEvent | null,
		newValue: string | null
	) => {
		setRenderActionFields(false);
		setAction(newValue as string);
		setFormState({});
		setAllowSubmission(false);
		setTimeout(() => setRenderActionFields(true), 500);
	};

	const handleFieldChange = (fieldName: string, value: string | object) => {
		setFormState((prev) => ({ ...prev, [fieldName]: value }));
	};
	useEffect(() => {
		if (action) {
			const keys = Object.keys(formState || {});
			const formKeys = FIELDS[action as keyof typeof FIELDS].map((e) => e.name);
			const scenarios = FIELDS[action as keyof typeof FIELDS].filter(
				(e) => e.name === "scenario"
			)[0];

			if (checker(keys, formKeys)) setAllowSubmission(true);
			else if (
				checker(keys, formKeys.filter(e => e !== "scenario")) &&
				scenarios?.domainDepended &&
				!scenarios.options[domain as keyof SELECT_OPTIONS]
			)
				setAllowSubmission(true);
			else setAllowSubmission(false);
		}
	}, [action, domain, formState]);

	const handleSubmit = async () => {
		console.log("Values", formState);
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/${domain.toLocaleLowerCase()}/initiate/${action}?mode=mock`,
				formState,
				{
					headers: {
						"Content-Type": "application/json"
					},
				}
			);
			console.log("Response from initiate", response);
			if (response.data.message.ack.status === "ACK" && action=== "search") {
				handleMessageToggle(`Your Transaction ID is: ${response.data.transaction_id}`)
			}
		} catch (error) {
			handleMessageToggle("Error Occurred while initiating request!")
			console.log("Error occurred", error);
		}
	};
	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					// height: "100%",
					p: 1,
					px: 2,
					// overflow: "hidden",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" my={1} mr={2}>
						Initiate Request:
					</Typography>
				</Box>
				<Stack spacing={2} sx={{ my: 2 }}>
					<Select placeholder="Select Action" onChange={handleActionSelection}>
						{Object.keys(FIELDS).map((action, idx) => (
							<Option value={action} key={"action-" + idx}>
								{action}
							</Option>
						))}
					</Select>
					<Grow in={renderActionFields} timeout={500}>
						<Stack spacing={2} sx={{ my: 2 }}>
							<Divider />
							{action &&
								FIELDS[action as keyof typeof FIELDS].map((field, index) => (
									<>
										{field.type === "text" ? (
											<Input
												fullWidth
												placeholder={field.placeholder}
												key={"input-" + action + "-" + index}
												onChange={(e) =>
													handleFieldChange(field.name, e.target.value)
												}
											/>
										) : field.type === "select" &&
										  field.domainDepended &&
										  field.options[domain as keyof SELECT_OPTIONS] ? (
											<Select
												placeholder={field.placeholder}
												key={"select-" + action + "-" + index}
												onChange={(
													_event: React.SyntheticEvent | null,
													newValue: string | null
												) => handleFieldChange(field.name, newValue as string)}
											>
												{(
													field.options[
														domain as keyof SELECT_OPTIONS
													] as string[]
												).map((option, index: number) => (
													<Option value={option} key={option + index}>
														{option}
													</Option>
												))}
											</Select>
										) : field.type === "select" && !field.domainDepended ? (
											<Select
												placeholder={field.placeholder}
												key={"select-" + action + "-" + index}
												onChange={(
													_event: React.SyntheticEvent | null,
													newValue: string | null
												) => handleFieldChange(field.name, newValue as string)}
											>
												{(field.options as string[]).map(
													(option, index: number) => (
														<Option value={option} key={option + index}>
															{option}
														</Option>
													)
												)}
											</Select>
										) : (
											<></>
										)}
									</>
								))}
						</Stack>
					</Grow>
				</Stack>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						variant="solid"
						onClick={handleSubmit}
						disabled={!allowSubmission}
					>
						Send
					</Button>
				</Box>
			</Paper>
		</Fade>
	);
};
