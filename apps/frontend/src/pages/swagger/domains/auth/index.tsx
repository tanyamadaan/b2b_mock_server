import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { SWAGGER_BUILD_LINK } from "../../../../utils";
import { Toolbar } from "@mui/material";
import { Button } from "@mui/joy";
import { Download } from "@mui/icons-material";
import swaggerSpec from "backend/auth.yaml";

export const AuthSwagger = () => {
	swaggerSpec.servers = swaggerSpec.servers.map(({ url }: { url: string }) =>
		url.startsWith(import.meta.env.VITE_SERVER_URL)
			? { url }
			: {
					url: import.meta.env.VITE_SERVER_URL + url
			  // eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
	);

	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<a href={SWAGGER_BUILD_LINK} target="_blank" download="ONDC Swagger">
					<Button startDecorator={<Download />}>Download Collection</Button>
				</a>
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
