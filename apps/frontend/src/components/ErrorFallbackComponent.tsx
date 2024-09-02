import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Grow,
	Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallbackComponent = ({
	error,
	resetErrorBoundary,
}: FallbackProps) => {
  const theme = useTheme()
	console.log("THIS IS RENDERED", error);
	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Grow timeout={2000} in={true}>
				<Card sx={{ maxWidth: "sm" }}>
					<CardHeader title="Error Info" />
					<CardContent>
						<Typography variant="body1">
							Something went wrong while handling your request! Please head back to the app.
						</Typography>
						<Typography variant="body2">
							Here is a Stack trace of what went wrong:
						</Typography>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								Error Details:
							</AccordionSummary>
							<AccordionDetails>
                <Typography variant="h5" sx={{backgroundColor: theme.palette.grey[100]}}>{JSON.stringify(error?.name)}</Typography>
                <Typography variant="body2" sx={{backgroundColor: theme.palette.grey[200]}}>{JSON.stringify(error?.message)}</Typography>
                <Typography variant="body2" sx={{backgroundColor: theme.palette.grey[300]}}>{JSON.stringify(error?.stack)}</Typography>
              </AccordionDetails>
						</Accordion>
					</CardContent>
					<CardActions>
						<Button variant="contained" onClick={() => resetErrorBoundary()}>
							Get Back to App
						</Button>
					</CardActions>
				</Card>
			</Grow>
		</Container>
	);
};
