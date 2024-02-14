import { useState } from "react";
import { CurlDisplay } from "../../components";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import FormHelperText from "@mui/joy/FormHelperText";
import { InfoOutlined } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import Select, { selectClasses } from "@mui/joy/Select";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/joy/Button";
import Option from "@mui/joy/Option";
import { useAction, useSandbox } from "../../utils/hooks";
import { URL_MAPPING } from "../../utils";
import axios from "axios";

export const RequestSection = () => {
	const [authHeader, setAuthHeader] = useState<string>();
	const [log, setLog] = useState<string>();
	const [showCurl, setShowCurl] = useState(false);
	const [activeScenario, setActiveScenario] = useState<object>();
	const { action, detectAction, logError, scenarios } = useAction();
	const { setSyncResponse } = useSandbox();
	const [curl, setCurl] = useState<string>();

	const handleLogChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setLog(e.target.value);
		detectAction(e.target.value);
	};
	const handleSubmit = async () => {
		const url = `${[import.meta.env.VITE_SERVER_URL]}/${Object.keys(
			URL_MAPPING
		).filter((key) =>
			URL_MAPPING[key as keyof typeof URL_MAPPING].includes(action as string)
		)}/${action}?mode=sandbox`;
		console.log("Form Values", log, activeScenario, url);
		setCurl(`curl -X POST \\
		  ${url} \\
		-H 'accept: application/json' \\
		-H 'Content-Type: application/json' \\
		-H 'authorization: ${authHeader} \\
		-d '${log}'`);
		try {
			console.log("SENDING REQUEST");
			const response = await axios.post(url, JSON.parse(log as string), {
				headers: {
					"Content-Type": "application/json",
					authorization: authHeader,
				},
			});
			console.log("RESPONSE RECEIVED", response);
			if (response.data.error) {
				setSyncResponse(response.data);
			} else setSyncResponse(response.data.sync);
		} catch (error) {
			console.log("ERROR Occured while pinging backend:", error);
		}
		setShowCurl(true);
	};
	return (
		<>
			<Fade in={true} timeout={1500}>
				<Paper
					sx={{
						p: 2,
					}}
					elevation={5}
				>
					<Stack spacing={2} justifyContent="center" alignItems="center">
						<Box
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						></Box>
						<Input
							fullWidth
							placeholder="Enter Your Auth Header..."
							value={authHeader}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setAuthHeader(e.target.value)
							}
						/>
						<FormControl error={logError} sx={{ width: "100%" }}>
							<Textarea
								minRows={5}
								sx={{ width: "100%" }}
								placeholder="Enter Your Log..."
								value={log}
								onChange={handleLogChange}
							/>
							{logError && (
								<Stack justifyContent="center">
									<FormHelperText>
										<InfoOutlined />
										Opps! The log seems to be invalid.
									</FormHelperText>
								</Stack>
							)}
						</FormControl>
						{action && (
							<Grid container>
								<Grid item xs={12} md={6}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "flex-start",
											alignItems: "center",
										}}
									>
										<Typography mr={1}>Detected Action:</Typography>
										<Typography color="text.secondary" variant="body2">
											{action}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} md={6}>
									<Select
										placeholder="Select a scenario"
										indicator={<KeyboardArrowDown />}
										sx={{
											width: "100%",
											[`& .${selectClasses.indicator}`]: {
												transition: "0.2s",
												[`&.${selectClasses.expanded}`]: {
													transform: "rotate(-180deg)",
												},
											},
										}}
										onChange={(
											_event: React.SyntheticEvent | null,
											newValue: object
										) => {
											setActiveScenario(newValue);
										}}
									>
										{scenarios?.map((scenario, index) => (
											<Option value={scenario} key={"scenario-" + index}>
												{scenario.name}
											</Option>
										))}
									</Select>
								</Grid>
							</Grid>
						)}

						<Button variant="soft" onClick={handleSubmit} disabled={!action}>
							Submit
						</Button>
					</Stack>
				</Paper>
			</Fade>
			<CurlDisplay slideIn={showCurl} curl={curl} />
		</>
	);
};
