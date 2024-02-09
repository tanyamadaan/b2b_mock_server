import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 200;
const NAV_LINKS = [
	{
		name: "Mock Server",
		path: "/",
	},
	{
		name: "Sandbox",
		path: "/sandbox",
	},
];
type CustomDrawerProps = {
	children: React.ReactNode;
};

export const CustomDrawer = ({ children }: CustomDrawerProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_isClosing, setIsClosing] = React.useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	// const handleDrawerToggle = () => {
	// 	if (!isClosing) {
	// 		setMobileOpen(!mobileOpen);
	// 	}
	// };
	console.log("HELLO", location.pathname === "/sandbox");
	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{NAV_LINKS.map((link, index) => (
					<Grow in={true} timeout={1000}>
						<ListItem key={index} disablePadding>
							<ListItemButton
								onClick={() => navigate(link.path)}
								selected={location.pathname === link.path}
								sx={{
									"&.Mui-selected": {
										backgroundColor: theme.palette.primary.main,
									},
								}}
							>
								<ListItemText primary={link.name} />
							</ListItemButton>
						</ListItem>
					</Grow>
				))}
			</List>
			<Divider />
		</div>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					PaperProps={{
						sx: {
							backgroundColor: theme.palette.primary.dark,
							color: theme.palette.primary.contrastText,
						},
					}}
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					// p: 3,
					height: "100vh",
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					backgroundColor: theme.palette.grey[100],
				}}
			>
				{children}
			</Box>
		</Box>
	);
};
