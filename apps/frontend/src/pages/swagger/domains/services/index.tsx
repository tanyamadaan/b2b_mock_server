import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "openapi-specs/services.yaml";
import { SwaggerDownloadButton } from "../../../../components";

export const ServicesSwagger = () => {
	swaggerSpec.servers = swaggerSpec.servers.map(
		({ url, description }: { url: string; description: string }) => ({
			url: url.startsWith(import.meta.env.VITE_SERVER_URL)
				? url
				: import.meta.env.VITE_SERVER_URL + url.replace("/api", ""),
			description,
		})
	);

	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<SwaggerDownloadButton
					swaggerYaml={swaggerSpec}
					fileName="Services.yaml"
				/>
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
