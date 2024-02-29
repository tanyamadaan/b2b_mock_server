import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SandboxProvider } from "../../utils/context";
import { Outlet } from "react-router-dom";
import { SandboxSyncResponseSection } from "./SandboxSyncResponseSection";

export const Sandbox = () => {
	return (
		<SandboxProvider>
			<Container sx={{ py: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} lg={8}>
						<Outlet />
					</Grid>
					<Grid item xs={12} lg={4}>
						<SandboxSyncResponseSection/>
					</Grid>
				</Grid>
			</Container>
		</SandboxProvider>
	);
};
