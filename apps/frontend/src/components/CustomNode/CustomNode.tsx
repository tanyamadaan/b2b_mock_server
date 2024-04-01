import { Handle, NodeProps, Position } from "reactflow";
import "./index.css"
export type CustomNodeData = {
	title: string;
	subline?: string;
};

export const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
	return (
		<div className="wrapper gradient">
			<div className="inner">
				<div className="body">
					<div>
						<div className="title">{data.title}</div>
						{data.subline && <div className="subline">{data.subline}</div>}
					</div>
				</div>
				<Handle type="target" position={Position.Top} id="top" />
				<Handle type="source" position={Position.Bottom} id="bottom" />
				<Handle type="source" position={Position.Right} id="right" />
				<Handle type="target" position={Position.Left} id="left" />
			</div>
		</div>
	);
};
