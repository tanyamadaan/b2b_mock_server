import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { NodeProps } from "reactflow";

export type NpNodeData = {
	title: string;
	subline?: string;
};

export const NpNode = ({ data: { title, subline } }: NodeProps<NpNodeData>) => {
	return (
		<Paper sx={{ p: 1 }}>
			<Typography>{title}</Typography>
			<Typography>{subline}</Typography>
		</Paper>
	);
};
