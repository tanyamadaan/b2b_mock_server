import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { RequestSection } from "./RequestSection";

export const Sandbox = () => {
	return (
		<Container sx={{ py: 2 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h3" my={2} align="center">
						ONDC Sandbox Server
					</Typography>
				</Grid>
				<Grid item xs={12} lg={8}>
					<RequestSection />
				</Grid>
				<Grid container item xs={12} lg={4} spacing={2}>
					<Grid item xs={12}>
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
				</Grid>
			</Grid>
		</Container>
	);
};
