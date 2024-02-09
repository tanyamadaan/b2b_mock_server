import React, { useState } from "react";
import { InfoOutlined } from "@mui/icons-material";
import Switch from "@mui/joy/Switch";
import Textarea from "@mui/joy/Textarea";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { SCENARIOS } from "../../utils";

export const Mock = () => {
	const [log, setLog] = useState<string>();
	const [action, setAction] = useState<string>();
	const [logError, setLogError] = useState(false);
	const [mockerNP, setMockerNP] = useState<boolean>(false); // false-> Buyer/BAP; true -> Seller/BPP
	const [scenarios, setScenarios] = useState<object>();
	const handleLogChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		try {
			setLog(e.target.value);
			const parsedLog = JSON.parse(e.target.value);
			if (!parsedLog.context!.action) setLogError(true);
			const parsedAction = parsedLog.context.action 
			setAction(parsedAction);
			const scenarioKey = Object.keys(SCENARIOS).filter(
				(key) => key === parsedAction
			)[0];
			if(scenarioKey){

				setScenarios(SCENARIOS[scenarioKey as keyof typeof SCENARIOS])
			}

			setLogError(false);
		} catch (error) {
			console.log("Error Occurred in LOG", error);
			setLogError(true);
			setAction(undefined);
		}
	};
	const handleSubmit = () => {
		console.log("Form Values", log);
	};
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h3" my={2} align="center">
						ONDC Mock Server
					</Typography>
				</Grid>
				<Grid item xs={12} lg={8}>
					<Fade in={true} timeout={2000}>
						<Paper
							sx={{
								p: 2,
							}}
						>
							<Stack spacing={2} justifyContent="center" alignItems="center">
								<Box
									sx={{
										width: "100%",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<Switch
										color={mockerNP ? "warning" : "danger"}
										slotProps={{ input: { "aria-label": "dark mode" } }}
										startDecorator={<Typography>Buyer</Typography>}
										endDecorator={<Typography>Seller</Typography>}
										checked={mockerNP}
										onChange={() => setMockerNP((prev) => !prev)}
									/>
								</Box>
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
											>
												<Option value="normal">Normal</Option>
												<Option value="scenario1">Scenarion 1</Option>
												<Option value="scenario2">Scenario 2</Option>
											</Select>
										</Grid>
									</Grid>
								)}
								<Button variant="solid" onClick={handleSubmit}>
									Submit
								</Button>
							</Stack>
						</Paper>
					</Fade>
				</Grid>
				<Grid container item xs={12} lg={4} spacing={2}>
					<Grid container item xs={6} lg={12}>
						<Fade in={true} timeout={2500}>
							<Paper
								sx={{
									width: "100%",
									p: 1,
									px: 2,
								}}
							>
								<Typography variant="h6">Sync:</Typography>
								<Typography color="text.secondary" variant="subtitle2">
									Awaiting Request
								</Typography>
							</Paper>
						</Fade>
					</Grid>
					<Grid container item xs={6} lg={12}>
						<Fade in={true} timeout={2500}>
							<Paper
								sx={{
									width: "100%",
									p: 1,
									px: 2,
								}}
							>
								<Typography variant="h6">Async:</Typography>
								<Typography color="text.secondary" variant="subtitle2">
									Awaiting Request
								</Typography>
							</Paper>
						</Fade>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
};
