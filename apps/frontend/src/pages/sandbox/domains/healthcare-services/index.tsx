import Grid from "@mui/material/Grid";
import { SandboxRequestSection } from "../../../../components";
import { InitiateRequestSection } from "../../InitiateRequestSection";
import { SandboxSyncResponseSection } from "../../SandboxSyncResponseSection";

export const HealthCareServicesSandbox = () => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} lg={8}>
				<SandboxRequestSection domain="healthcare-services" />
			</Grid>
			<Grid container item xs={12} lg={4}>
				<Grid item xs={12} sm={6} lg={12}>
					<InitiateRequestSection domain="healthcare-services"/>
				</Grid>
				<Grid item xs={12} sm={6} lg={12}>
					<SandboxSyncResponseSection />
				</Grid>
			</Grid>
		</Grid>
	);
};
