import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";

export const Analyse = () => {
	const theme = useTheme();
  console.log("TOOL BAR", theme.mixins.toolbar.minHeight)
	return (
		<Container
			sx={{
				// py: 2,
				background: `url("./ondc_logo.png") no-repeat center center fixed`,
				backgroundSize: "fit",
				height: `calc(100% - ${theme.mixins.toolbar.minHeight as number + 10}px)`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Fade in={true} timeout={800}>
				<Typography variant="h3" color="text.secondary" my={2}>
					Transaction Analyser
				</Typography>
			</Fade>
			<Grow in={true} timeout={1000}>
				<Paper
					sx={{
						maxWidth: "sm",
						width: "100%",
						p: 0.5,
						borderRadius: theme.shape.borderRadius * 2,
					}}
					elevation={5}
				>
					<Box
						sx={{
							height: "100%",
							width: "100%",
							borderStyle: "solid",
							borderColor: theme.palette.divider,
							borderRadius: theme.shape.borderRadius * 2,
							borderWidth: 1,
							px: 1,

							display: "flex",
							alignItems: "center",
						}}
					>
						<InputBase
							sx={{ ml: 1, flex: 1, p: 0 }}
							placeholder="Enter your Transaction ID"
							inputProps={{ "aria-label": "Enter your Transaction ID" }}
						/>

						<IconButton type="button" sx={{ p: 1 }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Box>
				</Paper>
			</Grow>
		</Container>
	);
};
