import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { useRef } from "react";

const localTheme = createTheme({
	palette: {
		mode: "dark",
	},
});
type CurlDisplayProps = {
	slideIn: boolean;
};
export const CurlDisplay = ({ slideIn }: CurlDisplayProps) => {
	const containerRef = useRef<HTMLElement>(null);
	return (
    <Box 
    sx={{
      overflow: "hidden"
    }}
    ref={containerRef}>
		<ThemeProvider theme={localTheme}>
			<Slide
				in={slideIn}
				timeout={1500}
				container={containerRef.current}
				mountOnEnter
				unmountOnExit
			>
				<Paper
					sx={{
						p: 2,
					}}
				>
					<Typography variant="h6">Curl:</Typography>
					<Typography color="text.secondary">Something Here</Typography>
				</Paper>
			</Slide>
		</ThemeProvider>
    </Box>
	);
};
