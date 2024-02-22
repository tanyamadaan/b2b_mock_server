import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSandbox } from "../../utils/hooks";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

export const SyncResponseSection = () => {
	const { syncResponse } = useSandbox();
	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					height: "100%",
					p: 1,
					px: 2,
				}}
			>
				<Typography variant="h6" my={1}>Sync Response:</Typography>
				{syncResponse ? (
					<CodeMirror
						value={JSON.stringify(syncResponse, null, 2)}
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
							// lineWrapping: true,
							indentWithTabs: false,
							tabSize: 2,
						}}
					/>
				) : (
					<Typography color="text.secondary" variant="subtitle2">
						Click on Submit to initiate Response
					</Typography>
				)}
			</Paper>
		</Fade>
	);
};
