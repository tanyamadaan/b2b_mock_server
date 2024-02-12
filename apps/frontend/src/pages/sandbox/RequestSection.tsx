import { useState } from "react";
import { CurlDisplay } from "../../components";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Switch from "@mui/joy/Switch";
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
import { useAction } from "../../utils/hooks";

export const RequestSection = () => {
	const [authHeader, setAuthHeader] = useState<string>();
	const [log, setLog] = useState<string>();
	const [mockerNP, setMockerNP] = useState<boolean>(false); // false-> Buyer/BAP; true -> Seller/BPP
  const [showCurl, setShowCurl] = useState(false);
	const [activeScenario, setActiveScenario] = useState<object>();
	const { action, detectAction, logError, scenarios } = useAction();

	const handleLogChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setLog(e.target.value);
		detectAction(e.target.value);
	};
	const handleSubmit = () => {
		console.log("Form Values", authHeader, log, activeScenario);
    setShowCurl(prev => !prev)
	};
	return (
		<>
			<Fade in={true} timeout={2000}>
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

						<Button variant="solid" onClick={handleSubmit}>
							Submit
						</Button>
					</Stack>
				</Paper>
			</Fade>
			<CurlDisplay slideIn={showCurl} />
		</>
	);
};
