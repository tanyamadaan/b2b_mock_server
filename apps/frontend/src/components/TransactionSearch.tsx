import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import { getNodesAndEdges } from "../utils";
import axios from "axios";
import * as _ from "lodash";
import { useAnalyse } from "../utils/hooks";

export const TransactionSearch = () => {
	const theme = useTheme();
	const { setEdges, setNodes } = useAnalyse();
	const requestTransaction = _.debounce(
		async (
			event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/analyse/${event.target.value}`
				);
				const seen: Record<string, boolean> = {};
				const formattedResponse = response.data
					.reduce(
						(
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							uniqueArr: any[],
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
					);
				console.log("RESPONSE", formattedResponse);
				const { edgeSet, nodeSet } = getNodesAndEdges(formattedResponse, theme);
				setNodes(nodeSet);
				setEdges(edgeSet);
			} catch (error) {
				console.log("Following error occurred while querying", error);
			}
		},
		500
	);
	return (
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
	);
};
