import React, { useState, useEffect } from "react";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { INITIATE_FIELDS } from "../../utils";
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
import { Item } from "../../../../backend/src/lib/utils/interfaces";

export const LogisticsInitiateRequestSection = () => {
	const { handleMessageToggle, setMessageType } = useMessage();
	const [action, setAction] = useState<string>();
	const [renderActionFields, setRenderActionFields] = useState(false);
	const [formState, setFormState] = useState<{ [key: string]: any }>({});
	const [allowSubmission, setAllowSubmission] = useState<boolean>(false);
	const [transactionId, setTransactionId] = useState<string>("");
	const [showCatalogSelect, setShowCatalogSelect] = useState<boolean>(false);
	const [matchingItems, setMatchingItems] = useState<Item[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string>("");

	const handleSelectionChange = (
		_event: React.SyntheticEvent | null,
		newValue: string | null
	) => {
		setSelectedItemId(newValue as string | "");
		setFormState((prev) => ({ ...prev, ["itemID"]: newValue }));
	};

	const handleTransactionIdSubmit = async () => {
		try {
			const response = await axios.post<{
				message: { matchingItems: Item[] };
			}>(
				`${import.meta.env.VITE_SERVER_URL}/logistics/getCatalog/?mode=mock`,
				{ transactionId },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data && response.data.message) {
				setMatchingItems(response.data.message.matchingItems);
				setShowCatalogSelect(true);
			} else {
				console.error("Unexpected response format:", response.data);
			}
		} catch (error) {
			setShowCatalogSelect(false);
			console.error("Error fetching catalog:", error);
			handleMessageToggle("Error fetching catalog. Please try again.");
			setMessageType("error");
		}
	};

	const handleActionSelection = (
		_event: React.SyntheticEvent | null,
		newValue: string | null
	) => {
		setRenderActionFields(false);
		setAction(newValue as string);
		setFormState({});
		setAllowSubmission(false);
		setTransactionId("");
		setShowCatalogSelect(false);
		setMatchingItems([]);
		setSelectedItemId("");
		setTimeout(() => setRenderActionFields(true), 500);
	};

	const handleFieldChange = (fieldName: string, value: string | object) => {
		setFormState((prev) => ({ ...prev, [fieldName]: value }));
	};

	useEffect(() => {
		if (action) {
			const logisticsInitKeys = ["transactionId", "itemID"];
			const logisticsCancelKeys = ["transactionId", "cancellationReasonId"];

			if (action === "init") {
				if (logisticsInitKeys.every((key) => key in formState)) {
					setAllowSubmission(true);
				} else {
					setAllowSubmission(false);
				}
			} else if (action === "cancel") {
				if (logisticsCancelKeys.every((key) => key in formState)) {
					setAllowSubmission(true);
				} else {
					setAllowSubmission(false);
				}
			}
		}
	}, [action, formState]);

	const handleSubmit = async () => {
		try {
			const response = await axios.post(
				`${
					import.meta.env.VITE_SERVER_URL
				}/logistics/initiate/${action}?mode=mock`,
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
				handleMessageToggle("Request Initiated Successfully!");
				setMessageType("success");
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
			<Paper sx={{ width: "100%", p: 1, px: 2 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" my={1} mr={2}>
						Initiate Logistics Request:
					</Typography>
					<Tooltip title="Initiate Logistics Requests here 👇">
						<IconButton>
							<HelpOutlineTwoToneIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Stack spacing={2} sx={{ my: 2 }}>
					<Select placeholder="Select Action" onChange={handleActionSelection}>
						{Object.keys(INITIATE_FIELDS)
							.filter((action) => action !== "select")
							.map((action, idx) => (
								<Option value={action} key={"action-" + idx}>
									{action}
								</Option>
							))}
					</Select>
					<Grow in={renderActionFields} timeout={500}>
						<Stack spacing={2} sx={{ my: 2 }}>
							<Divider />
							{action === "init" && (
								<React.Fragment>
									<Input
										type="text"
										value={transactionId}
										placeholder="Enter Transaction ID"
										onChange={(e) => {
											setTransactionId((e.target as HTMLInputElement).value);
											handleFieldChange("transactionId", e.target.value);
										}}
									/>
									<Button onClick={handleTransactionIdSubmit}>Submit</Button>
									{showCatalogSelect && (
										<Select
											id="matchingItemsDropdown"
											value={selectedItemId || ""}
											onChange={handleSelectionChange}
											placeholder="Select an item"
										>
											<Option value="" disabled>
												Select an item
											</Option>
											{matchingItems.map((item) => (
												<Option key={item.id} value={item.id}>
													{item.id}
												</Option>
											))}
										</Select>
									)}
								</React.Fragment>
							)}
							{action === "cancel" && (
								<React.Fragment>
									<Input
										fullWidth
										placeholder="Enter Transaction ID"
										onChange={(e) =>
											handleFieldChange("transactionId", e.target.value)
										}
									/>
									<Input
										fullWidth
										placeholder="Enter Order ID"
										onChange={(e) =>
											handleFieldChange("orderId", e.target.value)
										}
									/>
									<Select
										placeholder="Select Cancellation Reason"
										onChange={(_event, newValue) =>
											handleFieldChange(
												"cancellationReasonId",
												newValue as string
											)
										}
									>
										{INITIATE_FIELDS.cancel
											.find((field) => field.name === "cancellationReasonId")
											?.options?.logistics?.map((option, index) => (
												<Option value={option} key={`${option}-${index}`}>
													{option}
												</Option>
											))}
									</Select>
								</React.Fragment>
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
