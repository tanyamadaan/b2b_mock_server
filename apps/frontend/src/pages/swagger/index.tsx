import Container from "@mui/material/Container";
import SwaggerUI from "swagger-ui-react";

export const Swagger = () => {
	return (
		<Container>
			<SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
		</Container>
	);
};
