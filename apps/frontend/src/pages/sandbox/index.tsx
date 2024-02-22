import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { RequestSection } from "./RequestSection";
import { SandboxProvider } from "../../utils/context";
import { SyncResponseSection } from "./SyncResponseSection";

export const Sandbox = () => {
	return (
		<SandboxProvider>
			<Container sx={{ py: 2 }}>
				<Grid container spacing={2}>
					{/* <Grid item xs={12}>
						<Typography variant="h3" my={2} align="center">
							ONDC Sandbox Server
						</Typography>
					</Grid> */}
					<Grid item xs={12} lg={8}>
						<RequestSection />
					</Grid>
					<Grid item xs={12} lg={4}>
						<SyncResponseSection />
					</Grid>
				</Grid>
			</Container>
		</SandboxProvider>
	);
};
