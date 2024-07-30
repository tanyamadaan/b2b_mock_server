import { Toolbar } from "@mui/material";
import "swagger-ui-react/swagger-ui.css";
import { SwaggerDownloadButton } from "../../components";
import b2bswaggerSpec from "openapi-specs/retail-b2b.json";
import b2cswaggerSpec from "openapi-specs/b2c.json";
import serviceswaggerSpec from "openapi-specs/services.json";
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import { useDomain } from "../../utils/hooks";

export const Swagger = () => {
	const [swaggerSpec, setSwaggerSpec] = useState(b2bswaggerSpec);
	const [fileName, setFileName] = useState("B2b.yaml")
	const { domain } = useDomain();

	useEffect(()=>{
		const swaggerFile = domain === "b2b"?b2bswaggerSpec:domain === "b2c"?b2cswaggerSpec:serviceswaggerSpec;
		const yamlFileName = domain === "b2b"?"B2b.yaml":domain === "b2c"?"B2c.yaml":"services.yaml";
		setSwaggerSpec(swaggerFile);
		setFileName(yamlFileName);
	},[domain])

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
						fileName={fileName}
					/>
			</Toolbar>
				<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
