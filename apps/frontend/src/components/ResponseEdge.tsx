import useTheme from "@mui/material/styles/useTheme";
import {
	BaseEdge,
	getBezierPath,
} from "reactflow";

type ResponseEdgeProps = {
	id: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	markerEnd: string;
};

export const ResponseEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	markerEnd,
  
}: ResponseEdgeProps) => {
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
          strokeDasharray: "4 1 1 3",
					strokeWidth: 3,
					stroke: theme.palette.secondary.light,
				}}
			/>
		</>
	);
};
