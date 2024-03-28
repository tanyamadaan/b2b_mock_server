import useTheme from "@mui/material/styles/useTheme";
import {
	BaseEdge,
	getBezierPath,
} from "reactflow";

type RequestEdgeProps = {
	id: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	markerEnd: string;
};

export const RequestEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	markerEnd,
}: RequestEdgeProps) => {
	const theme = useTheme();
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				markerEnd={markerEnd}
				style={{
					strokeWidth: 2,
					stroke: theme.palette.primary.light,
				}}
			/>
		</>
	);
};
