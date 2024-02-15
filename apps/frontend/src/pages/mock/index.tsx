import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { RequestSection } from "./RequestSection";
import { SyncResponseSection } from "./SyncResponseSection";
import { AsyncResponseSection } from "./AsyncResponseSection";
import { MockProvider } from "../../utils/context";

export const Mock = () => {
	return (
		<MockProvider>
			<Container sx={{ py: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="h3" my={2} align="center">
							ONDC Mock Server
						</Typography>
					</Grid>
					<Grid item xs={12} lg={8}>
						<RequestSection />
					</Grid>
					<Grid container item xs={12} lg={4} spacing={2}>
						<Grid item xs={6} lg={12}>
							<SyncResponseSection />
						</Grid>
						<Grid item xs={6} lg={12}>
							<AsyncResponseSection />
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</MockProvider>
	);
};
