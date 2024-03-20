import Container from "@mui/material/Container";
import { SandboxProvider } from "../../utils/context";
import { Outlet } from "react-router-dom";

export const Sandbox = () => {
	return (
		<SandboxProvider>
			<Container sx={{ py: 2 }}>
				<Outlet />
			</Container>
		</SandboxProvider>
	);
};
