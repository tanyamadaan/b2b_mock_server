import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

export const SyncResponseSection = () => {
	return (
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
	);
};
