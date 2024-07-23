import React, { useState, useEffect } from "react";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { checker, INITIATE_FIELDS } from "../../utils";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { CITY_CODE } from "../../utils/constants";
import { Input, Option, Select, Button } from "@mui/joy";
import axios, { AxiosError } from "axios";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import { useMessage } from "../../utils/hooks";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type InitiateRequestSectionProp = {
	domain:
		| "b2b"
		| "services"
		| "agri-services"
		| "healthcare-services"
		| "logistics";
};

type SELECT_OPTIONS =
	| string[]
	| { b2b: string[]; services: string[]; agri_services: string[] }
	| { b2b: string[]; services: string; agri_services: string[] }
	| { services: string[] }
	| { agri_services: string[] }
	| { healthcare_services: string[] }
	| { logistics: string[] }
	| object;

type SELECT_FIELD = {
	name: string;
	placeholder: string;
	type: string;
	domainDepended: boolean;
	options: SELECT_OPTIONS;
};

export const InitiateRequestSection = ({
	domain,
}: InitiateRequestSectionProp) => {
	const { handleMessageToggle, setMessageType, setCopy } = useMessage();
	const [action, setAction] = useState<string>();
	const [renderActionFields, setRenderActionFields] = useState(false);
	const [formState, setFormState] = useState<{ [key: string]: any }>({});
	const [allowSubmission, setAllowSubmission] = useState<boolean>(false);

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
			const formKeys = INITIATE_FIELDS[
				action as keyof typeof INITIATE_FIELDS
			].map((e) => e.name);
			const scenarios = INITIATE_FIELDS[
				action as keyof typeof INITIATE_FIELDS
			].filter((e) => e.name === "scenario")[0];
			console.log(formKeys);
			console.log(keys);
			const allRequiredKeysPresent = ['transactionId', 'cancellationReasonId']
				.every(key => formKeys.includes(key));
			if(domain === "logistics" && action === "cancel" && allRequiredKeysPresent) {
				setAllowSubmission(true);
			}

			else if (checker(keys, formKeys)) setAllowSubmission(true);
			else if (
				checker(
					keys,
					formKeys.filter((e) => e !== "scenario")
				) &&
				scenarios?.domainDepended &&
				!scenarios.options[domain as keyof SELECT_OPTIONS]
			)
				setAllowSubmission(true);
			else setAllowSubmission(false);
		}
	}, [action, domain, formState]);

	const handleSubmit = async () => {
		try {
			const response = await axios.post(
				`${
					import.meta.env.VITE_SERVER_URL
				}/${domain.toLocaleLowerCase()}/initiate/${action}?mode=mock`,
				formState,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (
				response.data.message.ack.status === "ACK" ||
				response.data.sync.message.ack.status === "ACK"
			) {
				if (action === "search") {
					handleMessageToggle(
						`Your Transaction ID is: ${
							response.data.transaction_id
								? response.data.transaction_id
								: response.data.async.context.transaction_id
						}`
					);
					setMessageType("success");
					setCopy(response.data.transaction_id);
				} else {
					handleMessageToggle("Request Initiated Successfully!");
					setMessageType("success");
				}
			} else if (response.data.error) {
				handleMessageToggle(
					`Error Occurred: ${
						response.data.error.message || response.data.error
					}`
				);
				setMessageType("error");
			}
		} catch (error: any) {
			setMessageType("error");
			console.log("error.response?.data?.error?.message", error);
			if (
				error instanceof AxiosError &&
				error.response?.data?.error?.message.error?.message
			)
				handleMessageToggle(
					error.response?.data?.error?.message.error?.message === "string"
						? error.response?.data?.error?.message.error?.message
						: "Error Occurred while initiating request!"
				);
			else handleMessageToggle("Error Occurred while initiating request!");
		}
	};

	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					p: 1,
					px: 2,
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" my={1} mr={2}>
						Initiate Request:
					</Typography>
					<Tooltip title="Are you a seller app, Initiate Requests here 👇">
						<IconButton>
							<HelpOutlineTwoToneIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Stack spacing={2} sx={{ my: 2 }}>
					<Select placeholder="Select Action" onChange={handleActionSelection}>
						{Object.keys(INITIATE_FIELDS)
							.filter(
								(action) => !(domain === "logistics" && action === "select")
							)
							.map((action, idx) => (
								<Option value={action} key={"action-" + idx}>
									{action}
								</Option>
							))}
					</Select>
					<Grow in={renderActionFields} timeout={500}>
						<Stack spacing={2} sx={{ my: 2 }}>
							<Divider />
							{action &&
								INITIATE_FIELDS[action as keyof typeof INITIATE_FIELDS].map(
									(field, index) => {
										// Skip rendering `orderId` if action is "cancel" and domain is "logistics"
										if (
											domain === "logistics" &&
											action === "cancel" &&
											field.name === "orderId"
										) {
											return null;
										}

										return (
											<React.Fragment key={`field-${action}-${index}`}>
												{field.type === "text" &&
												field.name !== "cancellationReasonId" ? (
													<Input
														fullWidth
														placeholder={field.placeholder}
														key={"input-" + action + "-" + index}
														onChange={(e) =>
															handleFieldChange(field.name, e.target.value)
														}
													/>
												) : field.type === "select" ||
												  (field.type === "text" &&
														field.name === "cancellationReasonId") ? (
													field.domainDepended ? (
														(() => {
															const options = field.options as any;

															// Special case for scenario field
															if (field.name === "scenario") {
																if (
																	options &&
																	domain in options &&
																	Array.isArray(options[domain]) &&
																	options[domain].length > 0
																) {
																	return (
																		<Select
																			placeholder={field.placeholder}
																			onChange={(
																				_event: React.SyntheticEvent | null,
																				newValue: string | null
																			) =>
																				handleFieldChange(
																					field.name,
																					newValue as string
																				)
																			}
																		>
																			{options[domain].map(
																				(
																					option: string,
																					optionIndex: number
																				) => (
																					<Option
																						value={option}
																						key={`${option}-${optionIndex}`}
																					>
																						{option}
																					</Option>
																				)
																			)}
																		</Select>
																	);
																}
																return null; // Render null if domain doesn't exist in options or has no options
															}

															// For other domain-dependent fields
															if (
																options &&
																options[domain] &&
																Array.isArray(options[domain]) &&
																options[domain].length > 0
															) {
																return (
																	<Select
																		placeholder={field.placeholder}
																		onChange={(
																			_event: React.SyntheticEvent | null,
																			newValue: string | null
																		) =>
																			handleFieldChange(
																				field.name,
																				newValue as string
																			)
																		}
																	>
																		{options[domain].map(
																			(option: string, optionIndex: number) => (
																				<Option
																					value={option}
																					key={`${option}-${optionIndex}`}
																				>
																					{option}
																				</Option>
																			)
																		)}
																	</Select>
																);
															} else {
																return (
																	<Input
																		fullWidth
																		placeholder={field.placeholder}
																		key={"input-" + action + "-" + index}
																		onChange={(e) =>
																			handleFieldChange(
																				field.name,
																				e.target.value
																			)
																		}
																	/>
																);
															}
														})()
													) : (
														<Select
															placeholder={field.placeholder}
															onChange={(
																_event: React.SyntheticEvent | null,
																newValue: string | null
															) =>
																handleFieldChange(
																	field.name,
																	newValue as string
																)
															}
														>
															{field.name === "city" &&
															domain === "logistics" ? (
																formState.domain === "ONDC:LOG10" ? (
																	CITY_CODE.map((option, optionIndex) => (
																		<Option
																			value={option}
																			key={`${option}-${optionIndex}`}
																		>
																			{option}
																		</Option>
																	))
																) : (
																	<Option value="UN:SIN">UN:SIN</Option>
																)
															) : Array.isArray(field.options) ? (
																field.options.map(
																	(option, optionIndex: number) => (
																		<Option
																			value={option}
																			key={`${option}-${optionIndex}`}
																		>
																			{option}
																		</Option>
																	)
																)
															) : null}
														</Select>
													)
												) : null}
											</React.Fragment>
										);
									}
								)}
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
