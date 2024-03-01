import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { SUPPORTED_DOMAINS, USER_GUIDE_LINK } from "../../utils";
import Button from "@mui/material/Button";

export const Landing = () => {
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
				href={USER_GUIDE_LINK}
				sx={{ textTransform: "none", mt: 2 }}
				color="primary"
				variant="contained"
			>
				Open User Guide
			</Button>
		</Container>
	);
};
