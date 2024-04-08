import { UnControlled as CodeMirror } from "react-codemirror2";
import { Controlled as CodeMirrorControlled } from "react-codemirror2";
import Button from "@mui/joy/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useAnalyse } from "../utils/hooks";
// import axios from "axios";
import { B2B_DOMAINS, copyToClipboard, URL_MAPPING } from "../utils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NEXT_ACTION } from "openapi-specs/constants";

export const LogDialog = () => {
	const { openLogDialog: open, setOpenLogDialog, logToShow } = useAnalyse();

	const [requestToBeSent, setRequestToBeSent] = useState<string>();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const log = logToShow as any;

	const [copiedRequest, setCopiedRequest] = useState(false);
	const toggleRequestCopy = () => {
		setCopiedRequest(true);
		setTimeout(function () {
			setCopiedRequest(false);
		}, 1000);
	};

	const [copiedResponse, setCopiedResponse] = useState(false);
	const toggleResponseCopy = () => {
		setCopiedResponse(true);
		setTimeout(function () {
			setCopiedResponse(false);
		}, 1000);
	};
	const [jsonParseError, setJsonParseError] = useState<boolean>(false);

	const [scenarios, setScenarios] =
		useState<{ name: string; scenario: string }[]>();
	const [activeScenario, setActiveScenario] = useState<string>("");
	let domain: string;
	if (B2B_DOMAINS.includes(log.request?.context.domain)) domain = "b2b";
	else domain = "services";
	const action = log.action;

	const toBeSent = log.toBeSent ? log.toBeSent : false;
	// const fetchScenarios = useCallback(async () => {
	// 	if (toBeSent) {
	// 		const { data } = await axios.get(
	// 			`${import.meta.env.VITE_SERVER_URL}/scenario/${domain}/${
	// 				NEXT_ACTION[action as keyof typeof NEXT_ACTION]
	// 			}`
	// 		);
	// 		console.log("RESPONSE for scenarios", data.scenarios);
	// 		setScenarios(data.scenarios);
	// 	}
	// }, [toBeSent]);

	// useEffect(() => {
	// 	fetchScenarios();
	// }, [fetchScenarios]);

	// const handleChange = async (event: SelectChangeEvent) => {
	// 	setActiveScenario(event.target.value as string);
	// 	let url = `${[
	// 		import.meta.env.VITE_SERVER_URL,
	// 	]}/${domain.toLowerCase()}/${Object.keys(URL_MAPPING).filter((key) =>
	// 		URL_MAPPING[key as keyof typeof URL_MAPPING].includes(action as string)
	// 	)}/${action}?mode=mock`;
	// 	if (activeScenario.length > 0) url = url + `&scenario=${activeScenario}`;
	// 	try {
	// 		const { data } = await axios.post(url, log.request, {
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		console.log("RESPONSE from MOCK", data.async);
	// 		setRequestToBeSent(JSON.stringify(data.async));
	// 	} catch (error) {
	// 		console.log("ERROR Occured while pinging backend:", error);
	// 	}
	// };

	// const handleRequest = async () => {

	// }

	return (
		<Dialog open={open} onClose={() => setOpenLogDialog(false)}>
			<DialogTitle variant="h5">Request Analyser</DialogTitle>
			<DialogContent>
				{log.action && (
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography>Action:</Typography>
						<Typography variant="body2" color="text.secondary">
							/
							{log.toBeSent
								? NEXT_ACTION[log.action as keyof typeof NEXT_ACTION]
								: log.action}
						</Typography>
					</Stack>
				)}
				{log.toBeSent && (
					<>
						<Divider sx={{ my: 2 }} />
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">
								Select A Scenario
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={activeScenario}
								label="Select a Scenario"
								onChange={handleChange}
							>
								{scenarios?.map((scenario, index) => (
									<MenuItem value={scenario.scenario} key={"scenario" + index}>
										{scenario.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</>
				)}
				{log.toBeSent && requestToBeSent && (
					<>
						<Divider sx={{ my: 2 }} />

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Request Body:</Typography>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={() =>
									copyToClipboard(JSON.parse(requestToBeSent || "{}"))
								}
							>
								{copiedRequest ? (
									<DoneAllIcon color="success" />
								) : (
									<ContentCopyIcon />
								)}
							</IconButton>
						</Stack>
						{jsonParseError && (
							<>
								<Typography color="error" my={1}>
									Error Occurred while parsing JSON.
								</Typography>
							</>
						)}
						<CodeMirrorControlled
							value={requestToBeSent}
							autoCursor={false}
							options={{
								theme: "material",
								height: "auto",
								viewportMargin: Infinity,
								mode: {
									name: "javascript",
									json: true,
									statementIndent: 2,
								},
								lineNumbers: true,
								lineWrapping: true,
								indentWithTabs: false,
								tabSize: 2,
							}}
							onBeforeChange={(_editor, _data, value) => {
								try {
									setRequestToBeSent(value);
									JSON.parse(value);
									if (jsonParseError) setJsonParseError(false);
								} catch (error) {
									console.log("ERROR Occurred while parsing JSON", error);
									setJsonParseError(true);
								}
							}}
							// onChange={(_editor, _data, _value) => {
							// }}
						/>
					</>
				)}
				{!log.toBeSent && log.request && (
					<>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Request:</Typography>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={() => copyToClipboard(log.request, toggleRequestCopy)}
							>
								{copiedRequest ? (
									<DoneAllIcon color="success" />
								) : (
									<ContentCopyIcon />
								)}
							</IconButton>
						</Stack>

						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>Request Timestamp:</Typography>
							<Typography variant="body2" color="text.secondary">
								{log.request.context.timestamp}
							</Typography>
						</Stack>
						<CodeMirror
							value={JSON.stringify(log.request, null, 2)}
							autoCursor={false}
							options={{
								readOnly: "nocursor",
								theme: "material",
								height: "auto",
								viewportMargin: Infinity,
								mode: {
									name: "javascript",
									json: true,
									statementIndent: 2,
								},
								lineNumbers: true,
								lineWrapping: true,
								indentWithTabs: false,
								tabSize: 2,
							}}
						/>
					</>
				)}
				{!log.toBeSent && log.response && (
					<>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Response:</Typography>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={() =>
									copyToClipboard(log.response, toggleResponseCopy)
								}
							>
								{copiedResponse ? (
									<DoneAllIcon color="success" />
								) : (
									<ContentCopyIcon />
								)}
							</IconButton>
						</Stack>
						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>Response Timestamp:</Typography>
							<Typography variant="body2" color="text.secondary">
								{log.response.timestamp}
							</Typography>
						</Stack>
						<CodeMirror
							value={JSON.stringify(log.response.response, null, 2)}
							autoCursor={false}
							options={{
								readOnly: "nocursor",
								theme: "material",
								height: "auto",
								viewportMargin: Infinity,
								mode: {
									name: "javascript",
									json: true,
									statementIndent: 2,
								},
								lineNumbers: true,
								lineWrapping: true,
								indentWithTabs: false,
								tabSize: 2,
							}}
						/>
					</>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="warning"
					startDecorator={<CancelTwoToneIcon />}
					onClick={() => setOpenLogDialog(false)}
				>
					Close
				</Button>
				{/* <Button
					color="success"
					endDecorator={<SendTwoToneIcon />}
					disabled={!toBeSent || requestToBeSent?.length === 0 || jsonParseError}
					onClick={handleRequest}
				>
					Send Request
				</Button> */}
			</DialogActions>
		</Dialog>
	);
};
