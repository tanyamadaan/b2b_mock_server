import Divider from "@mui/material/Divider";
//import Drawer from "@mui/material/Drawer";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
// import CodeIcon from '@mui/icons-material/Code';
// import HttpsIcon from '@mui/icons-material/Https';
// import InputIcon from '@mui/icons-material/Input';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import TerminalIcon from '@mui/icons-material/Terminal';
import Toolbar from "@mui/material/Toolbar";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import AppBar from '@mui/material/AppBar';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MenuIcon from "@mui/icons-material/Menu";
//import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";

const drawerWidth = 200;
const NAV_LINKS = [
	// {
	// 	name: "Mock Server",
	// 	path: "/",
	// },
	// {
	// 	name: "Sandbox",
	// 	path: "/sandbox",
	// },
	// {
	// 	name: "Swagger",
	// 	path: "/swagger",
	// 	nested: true,
	// 	children: [
	// 		{
	// 			name: "B2B",
	// 			path: "/swagger/b2b",
	// 		},
	// 	],
	// },
	{
		name: "B2B",
		path: "/",
		nested: true,
		children: [
			{
				name: "Mock Server",
				path: "/",
			},
			{
				name: "Sandbox",
				path: "/sandbox",
			},
			{
				name: "Swagger",
				path: "/swagger/b2b",
			}
		],
	},
];
type CustomDrawerProps = {
	children: React.ReactNode;
};

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
	  easing: theme.transitions.easing.sharp,
	  duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
  });
  
const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
	  easing: theme.transitions.easing.sharp,
	  duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
	  width: `calc(${theme.spacing(8)} + 1px)`,
	},
  });

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
  }));
  
  interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
  }
  
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
	  easing: theme.transitions.easing.sharp,
	  duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
	  marginLeft: drawerWidth,
	  width: `calc(100% - ${drawerWidth}px)`,
	  transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	  }),
	}),
  }));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
	  width: drawerWidth,
	  flexShrink: 0,
	  whiteSpace: 'nowrap',
	  boxSizing: 'border-box',
	  ...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	  }),
	  ...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	  }),
	}),
  );

type NestedMenuProps = {
	name: string;
	childPath: { name: string; path: string }[];
};

const NestedMenu = ({ name, childPath }: NestedMenuProps) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const [accordionOpened, setAccordionOpened] = React.useState(false);
	const iconMap: { [key: string]: JSX.Element } = {
		"Mock Server": <TerminalIcon />,
		"Sandbox": <DeveloperModeIcon />,
		"Swagger": <DataObjectIcon />,
	  };
	return (
		<Accordion
			// sx={{
			// 	// bgcolor: theme.palette.primary.light,
			// 	// color: theme.palette.primary.contrastText,
			// 	"&.Mui-selected": {
			// 		backgroundColor: theme.palette.primary.main,
			// 	},
			// }}
			elevation={0}
			expanded={accordionOpened}
			onChange={(_event, expanded) => setAccordionOpened(expanded)}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel2-content"
				id="nav-nested-menu"
			>
				<Typography>{name}</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ p:0 }}>
				<List>
					{childPath.map((link, index) => (
						<Grow in={accordionOpened} timeout={800}>
							<ListItem key={index} disablePadding sx={{ display: 'block' }}>
								<ListItemButton
									onClick={() => navigate(link.path)}
									selected={location.pathname === link.path}
									sx={{
										minHeight: 48,
										justifyContent: open ? 'initial' : 'center',
										px: 2.5,
										"&.Mui-selected": {
											backgroundColor: theme.palette.primary.light,
										},
									}}
								>
									<ListItemIcon
											sx={{
												minWidth: 0,
												//mr: open ? 3 : 'auto',
												mr: 2,
												justifyContent: 'center',
											}}
											>
											{iconMap[link.name]}
											{/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
										</ListItemIcon>
									<ListItemText primary={link.name} sx={{
                                            textAlign: "center",
                                            opacity: accordionOpened ? 1 : 0,
                                            //color: theme.palette.text.primary,
                                        }}/>
								</ListItemButton>
							</ListItem>
						</Grow>
					))}
				</List>
			</AccordionDetails>
		</Accordion>
	);
};

export const CustomDrawer = ({ children }: CustomDrawerProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isClosing, setIsClosing] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
		setOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};
	console.log("HELLO", location.pathname === "/sandbox");
	const drawer = (
		<div>
			<Toolbar />
			{/* <Divider /> */}
			<List>
				{NAV_LINKS.map((link, index) => (
					<>
						{link.nested ? (
							<NestedMenu name={link.name} childPath={link.children} />
						) : (
							<Grow in={true} timeout={1000}>
								<ListItem key={index} disablePadding sx={{ display: 'block' }}>
									<ListItemButton
										onClick={() => navigate(link.path)}
										selected={location.pathname === link.path}
										sx={{
											minHeight: 48,
											justifyContent: open ? 'initial' : 'center',
											px: 2.5,
											"&.Mui-selected": {
												backgroundColor: theme.palette.primary.main,
											},
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : 'auto',
												justifyContent: 'center',
											}}
											>
											{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
										</ListItemIcon>
										<ListItemText primary={link.name} sx={{ opacity: open ? 1 : 0 }} />
									</ListItemButton>
								</ListItem>
							</Grow>
						)}
					</>
				))}
			</List>
			<Divider />
		</div>
	);

	return (
		<Box sx={{ display: "flex"}}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					sx={{  
					marginRight: 5,
					...(open && { display: 'none' }),
					}}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div">
					ONDC Mock & Sandbox
				</Typography>
				</Toolbar>
			</AppBar>
			{/* <Box sx={{ display: "flex", flexGrow: 1 }}> */}
				{/* <Box
					component="nav"
					sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				> */}
					{/* <Drawer
						variant="temporary"
						open={mobileOpen}
						onTransitionEnd={handleDrawerTransitionEnd}
						onClose={handleDrawerClose}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
						PaperProps={{
							sx: {
								backgroundColor: theme.palette.primary.main,
								color: theme.palette.primary.contrastText,
							},
						}}
						sx={{
							
							display: { xs: "block", sm: "none" },
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
							},
						}}
					>
						<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<IconButton
								sx={{ color: theme.palette.primary.contrastText }}
								onClick={handleDrawerClose}
							>
								<MenuOpenIcon />
							</IconButton>
						</Box>
						{drawer}
					</Drawer> */}
					<Drawer
						variant="permanent"
						open={open}
						// PaperProps={{
						// 	sx: {
						// 		backgroundColor: theme.palette.primary.main,
						// 		color: theme.palette.primary.contrastText,
						// 	},
						// }}
						// sx={{
						// 	width: drawerWidth,
          				// 	flexShrink: 0,
						// 	display: { xs: "none", sm: "block" },
						// 	"& .MuiDrawer-paper": {
						// 		boxSizing: "border-box",
						// 		width: drawerWidth,
						// 	},
						// }}
						//open
					>
						<DrawerHeader>
							<IconButton onClick={handleDrawerClose}>
								{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
							</IconButton>
						</DrawerHeader>
						{drawer}
					</Drawer>
				{/* </Box> */}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: 3,
						minHeight: "100vh",
						width: { sm: `calc(100% - ${drawerWidth}px)` },
						backgroundColor: theme.palette.grey[100],
						marginTop: 8,
					}}
				>
					<IconButton
						sx={{ mx: "auto", display: { xs: "block", sm: "none" } }}
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
					{children}
				</Box>
			</Box>
		// </Box>
	);
};