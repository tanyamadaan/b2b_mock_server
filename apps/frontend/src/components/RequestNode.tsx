import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Handle, NodeProps, Position } from "reactflow";

export type RequestNodeData = {
	title: string;
	subline?: string;
};

export const RequestNode = ({ data: { title, subline } }: NodeProps<RequestNodeData>) => {
	return (
		<Paper sx={{ p: 1 }}>
			<Handle
				type="source"
				position={Position.Bottom}
				id="response"
				isConnectable={true}
				style={{ left: "70%" }}
			/>
			<Typography>{title}</Typography>
			<Typography>{subline}</Typography>
			<Handle
				type="target"
				position={Position.Top}
				id="request"
				isConnectable={true}
				style={{ left: "30%" }}
			/>
		</Paper>
	);
};
