import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

export const Swagger = () => {
	return (
		<Container>
			<Outlet/>
		</Container>
	);
};
