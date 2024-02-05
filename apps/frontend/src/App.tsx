import Typography from "@mui/material/Typography";
import { CustomDrawer } from "./components";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Stack,
	Switch,
} from "@mui/joy";
import { useState } from "react";
import { InfoOutlined } from "@mui/icons-material";

function App() {
	const [authHeader, setAuthHeader] = useState<string>();
	const [log, setLog] = useState<string>();
	const [action, setAction] = useState<string>();
	const [logError, setLogError] = useState(false);
	const [mockerNP, setMockerNP] = useState<boolean>(0); // false-> Buyer/BAP; true -> Seller/BPP
	const handleLogChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		try {
			setLog(e.target.value);
			const parsedLog = JSON.parse(e.target.value);
			if (!parsedLog.context!.action) setLogError(true);
			setAction(parsedLog.context.action);
			setLogError(false);
		} catch (error) {
			console.log("Error Occurred in LOG", error);
			setLogError(true);
			setAction(undefined);
		}
	};
	const handleSubmit = () => {
		console.log("Form Values", authHeader, log);
	};
	return (
		<>
			<CustomDrawer>
				{" "}
				<Fade in={true} timeout={2000}>
					<Paper
						sx={{
							mt: 4,
							p: 2,
						}}
					>
						<Stack spacing={2} justifyContent="center" alignItems="center">
							<Typography variant="h3">ONDC Mock Server</Typography>
							<Switch
								color={mockerNP ? "warning" : "danger"}
								slotProps={{ input: { "aria-label": "dark mode" } }}
								startDecorator={<Typography>Buyer</Typography>}
								endDecorator={<Typography>Seller</Typography>}
								checked={mockerNP}
								onChange={() => setMockerNP((prev) => !prev)}
							/>
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
									<FormHelperText>
										<InfoOutlined />
										Opps! The log seems to be invalid.
									</FormHelperText>
								)}
							</FormControl>
							{action && (
								<Box
									sx={{
										width: "100%",
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "baseline",
									}}
								>
									<Typography variant="body1" mr={2}>
										Detected Action:
									</Typography>
									<Typography color="text.secondary" variant="body2">
										{action}
									</Typography>
								</Box>
							)}
							<Button variant="soft" onClick={handleSubmit}>
								Submit
							</Button>
						</Stack>
					</Paper>
				</Fade>
			</CustomDrawer>
		</>
	);
}

export default App;
