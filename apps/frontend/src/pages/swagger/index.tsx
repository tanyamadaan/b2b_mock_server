import Container from "@mui/material/Container";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { SWAGGER_BUILD_LINK } from "../../utils";
import { Toolbar } from "@mui/material";
import { Button } from "@mui/joy";
import { Download } from "@mui/icons-material";

export const Swagger = () => {
	return (
		<Container>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<a
					href={SWAGGER_BUILD_LINK}
					target="_blank"
					download="ONDC Swagger"
				>
					<Button startDecorator={<Download />}>Download Collection</Button>
				</a>
			</Toolbar>
			<SwaggerUI url={SWAGGER_BUILD_LINK} />
		</Container>
	);
};
