import Container from "@mui/material/Container";
import { SUPPORTED_DOMAINS } from "../../utils";
import { Typography, Button } from "@mui/material";

export const Landing = () => {
	const openReadme = () => {
		window.location.href = "/user-guide";
	};

	return (
		<Container>
			<Typography variant="h2">Welcome to ONDC Server</Typography>
			<Typography variant="h4">
				To start testing, select a domain from the Navigation.
			</Typography>
			<Typography color="text.secondary">
				Currently supported domains are:
			</Typography>
			<ul style={{ margin: 0 }}>
				{SUPPORTED_DOMAINS.map((domain, index) => (
					<li key={"domain-" + index}>
						<Typography variant="body2" color="text.secondary">
							{domain}
						</Typography>
					</li>
				))}
			</ul>
			<Button
				sx={{ textTransform: "none", mt: 2 }}
				onClick={openReadme}
				color="primary"
				variant="contained"
			>
				Open User Guide
			</Button>
		</Container>
	);
};
