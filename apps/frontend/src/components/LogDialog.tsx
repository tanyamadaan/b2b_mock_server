import { UnControlled as CodeMirror } from "react-codemirror2";
import Button from "@mui/joy/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

type LogDialogPropType = {
	open: boolean;
	onClose: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	log: any;
};

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export const LogDialog = ({ open, onClose, log }: LogDialogPropType) => {
	console.log("DIALOG", log);

	const [copiedRequest, setCopiedRequest] = useState(false);
	const [copiedResponse, setCopiedResponse] = useState(false);

	const copyLogPart = (part: "request" | "response") => {
		navigator.clipboard
			.writeText(
				JSON.stringify(part === "request" ? log.request : log.response)
			)
			.then(() => {
				if (part === "request") {
					setCopiedRequest(true);
					setTimeout(function () {
						setCopiedRequest(false);
					}, 1000);
				} else {
					setCopiedResponse(true);
					setTimeout(function () {
						setCopiedResponse(false);
					}, 1000);
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle variant="h5">Request Analyser</DialogTitle>
			<DialogContent>
				{log.action && (
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography>Action:</Typography>
						<Typography variant="body2" color="text.secondary">
							/{log.action}
						</Typography>
					</Stack>
				)}

				<Divider sx={{ my: 2 }} />
				{log.request && (
					<>
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Request:</Typography>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={() => copyLogPart(log.request)}
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
				<Divider sx={{ my: 2 }} />
				{log.response && (
					<>
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="h6">Response:</Typography>
							<IconButton
								size="small"
								// sx={{
								// 	display: display ? "block" : "none",
								// }}
								onClick={() => copyLogPart(log.response)}
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
					onClick={onClose}
				>
					Close
				</Button>
				<Button color="success" endDecorator={<SendTwoToneIcon />} disabled>
					Resend Request
				</Button>
			</DialogActions>
		</Dialog>
	);
};
