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
import * as _ from "lodash";
import axios from "axios";
import { useState } from "react";
import { hexToRgb } from "@mui/material/styles";

import {
	LogDialog,
	CustomNode,
	CustomNodeData,
	CustomEdge,
} from "../../components";

import ReactFlow, {
	Background,
	Controls,
	MarkerType,
	MiniMap,
	useEdgesState,
	useNodesState,
	Node,
	Edge,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: Node<CustomNodeData>[] = [
	{
		id: "0",
		position: { x: 50, y: 0 },
		style: { width: "1000px", height: "50px" },
		data: { title: "Buyer App", subline: "mock.ondc.org" },
		type: "custom",
	},
	{
		id: "1",
		position: { x: 100, y: 100 },
		data: { title: "search" },
		type: "custom",
	},
	{
		id: "2",
		position: { x: 100, y: 300 },
		data: {
			title: "on_search",
		},
		type: "custom",
	},
	{
		id: "3",
		position: { x: 300, y: 100 },
		data: { title: "select" },
		type: "custom",
	},
	{
		id: "4",
		position: { x: 300, y: 300 },
		data: {
			title: "on_select",
		},
		type: "custom",
	},
	{
		id: "5",
		position: { x: 500, y: 100 },
		data: { title: "init" },
		type: "custom",
	},
	{
		id: "6",
		position: { x: 500, y: 300 },
		data: { title: "on_init" },
		type: "custom",
	},
	{
		id: "7",
		position: { x: 700, y: 100 },
		data: { title: "confirm" },
		type: "custom",
	},
	{
		id: "8",
		position: { x: 700, y: 300 },
		data: { title: "on_confirm" },
		type: "custom",
	},
	{
		id: "9",
		position: { x: 900, y: 100 },
		data: { title: "status" },
		type: "custom",
	},
	{
		id: "10",
		position: { x: 900, y: 300 },
		data: { title: "on_status" },
		type: "custom",
	},
	{
		id: "22",
		position: { x: 50, y: 420 },
		style: { width: "1000px", height: "50px" },
		data: { title: "Seller App", subline: "Rapidor NP" },
		type: "custom",
	},
];

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

export const Analyse = () => {
	const theme = useTheme();

	const initialEdges: Edge[] = [
		{
			id: "e1-2",
			source: "1",
			target: "2",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: true,
		},
		{
			id: "e2-3",
			source: "2",
			target: "3",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.secondary.dark,
			},
			sourceHandle: "right",
			targetHandle: "left",
		},
		{
			id: "e3-4",
			source: "3",
			target: "4",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.primary.dark,
			},
			animated: true,
		},
		{
			id: "e4-5",
			source: "4",
			target: "5",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.secondary.dark,
			},
			sourceHandle: "right",
			targetHandle: "left",
		},
		{
			id: "e5-6",
			source: "5",
			target: "6",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.primary.dark,
			},
			animated: true,
		},
		{
			id: "e6-7",
			source: "6",
			target: "7",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.secondary.dark,
			},
			sourceHandle: "right",
			targetHandle: "left",
		},
		{
			id: "e7-8",
			source: "7",
			target: "8",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.primary.dark,
			},
			animated: true,
		},
		{
			id: "e8-9",
			source: "8",
			target: "9",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.secondary.dark,
			},
			sourceHandle: "right",
			targetHandle: "left",
		},
		{
			id: "e9-10",
			source: "9",
			target: "10",
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				// width: 20,
				// height: 20,
				color: theme.palette.primary.dark,
			},
			animated: true,
		},
	];
	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, , onEdgesChange] = useEdgesState(initialEdges);


	const [openLogDialog, setOpenLogDialog] = useState(false);
	const [logToShow, setLogToShow] = useState<object>({});
	const [responseLogs, setResponseLogs] = useState<object[]>();

	const handleLogDialog = (log: object) => {
		setLogToShow(log);
		setOpenLogDialog(true);
	};

	// const logs = logsJSON.sort(
	// 	(a, b) =>
	// 		new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
	// );

	// console.log("LOGS", logs);

	const requestTransaction = _.debounce(
		async (
			event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/analyse/${event.target.value}`
				);
				console.log("RESPONSE", response);
				const seen: Record<string, boolean> = {};
				setResponseLogs(
					response.data
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						.reduce(
							(
								uniqueArr: any[],
								item: { request: { context: { action: any; timestamp: any } } }
							) => {
								const { action, timestamp } = item.request.context;
								if (!seen[action] || timestamp > seen[action]) {
									seen[action] = timestamp; // Update latest timestamp for the action
									const existingIndex = uniqueArr.findIndex(
										(obj) => obj.action === action
									);
									if (existingIndex !== -1) {
										uniqueArr[existingIndex] = item;
									} else {
										uniqueArr.push(item);
									}
								}
								return uniqueArr;
							},
							[]
						)
						.sort(
							(
								a: {
									request: { context: { timestamp: string | number | Date } };
								},
								b: {
									request: { context: { timestamp: string | number | Date } };
								}
							) =>
								new Date(a.request.context.timestamp!).getTime() -
								new Date(b.request.context.timestamp!).getTime()
						)
				);
			} catch (error) {
				console.log("Following error occurred while querying", error);
			}
		},
		500
	);
	return (
		<Container
			sx={{
				// py: 2,
				// background: `url("./ondc_logo.png") no-repeat center center fixed`,
				// backgroundSize: "fit",
				height: `calc(100% - ${
					(theme.mixins.toolbar.minHeight as number) + 10
				}px)`,
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
							onChange={requestTransaction}
						/>

						<IconButton type="button" sx={{ p: 1 }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Box>
				</Paper>
			</Grow>
			<Paper
				sx={{
					my: 10,
					minWidth: "100%",
					p: 2,
					borderRadius: theme.shape.borderRadius * 2,
					background: hexToRgb(theme.palette.background.paper).replace(
						")",
						",0.05)"
					),
					backdropFilter: `blur(6px)`,
					_webkitBackDropFilter: `blur(6px)`,
				}}
				elevation={5}
			>
				<Box
					sx={{
						borderStyle: "solid",
						borderColor: theme.palette.divider,
						borderRadius: theme.shape.borderRadius,
						borderWidth: 1,
						p: 1,
						height: 500,
					}}
				>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
					>
						<MiniMap />
						<Controls />
						<Background />
					</ReactFlow>
				</Box>
			</Paper>
			<LogDialog
				open={openLogDialog}
				onClose={() => setOpenLogDialog(false)}
				log={logToShow}
			/>
		</Container>
	);
};
