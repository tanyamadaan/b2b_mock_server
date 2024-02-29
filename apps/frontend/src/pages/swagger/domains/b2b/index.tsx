import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "backend/retail-b2b.yaml";
import { SwaggerDownloadButton } from "../../../../components";

export const B2BSwagger = () => {
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
				<SwaggerDownloadButton swaggerYaml={swaggerSpec} fileName="B2B.yaml" />
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
