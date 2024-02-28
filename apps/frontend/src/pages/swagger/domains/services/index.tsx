import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "backend/services.yaml";
import { SwaggerDownloadButton } from "../../../../components";

export const ServicesSwagger = () => {
	swaggerSpec.servers = swaggerSpec.servers.map(({ url }: { url: string }) =>
		url.startsWith(import.meta.env.VITE_SERVER_URL)
			? { url }
			: {
					url: import.meta.env.VITE_SERVER_URL + url,
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
				<SwaggerDownloadButton
					swaggerYaml={swaggerSpec}
					fileName="Services.yaml"
				/>
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
