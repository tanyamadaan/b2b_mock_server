import { Edge, MarkerType, Node } from "reactflow";
import { CustomNodeData } from "../components";
import { Theme } from "@mui/material/styles";
import { PREV_ACTION } from "openapi-specs/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNodesAndEdges = (formattedResponse: any, theme: Theme) => {
	const { transaction_id, bpp_id, bpp_uri, bap_id, bap_uri } =
		formattedResponse.filter(
			(e: { action: string }) => e.action === "on_search"
		)[0].request.context;

	const nodes: Node<CustomNodeData>[] = [
		{
			id: `${transaction_id}-buyer`,
			position: { x: 50, y: 0 },
			style: { width: "1000px", height: "50px" },
			data: { title: "Buyer App", subline: bap_id, uri: bap_uri },
			type: "custom",
		},
		{
			id: `${transaction_id}-seller`,
			position: { x: 50, y: 420 },
			style: { width: "1000px", height: "50px" },
			data: { title: "Seller App", subline: bpp_id, uri: bpp_uri },
			type: "custom",
		},
	];
	const edges: Edge[] = [];
	let initialX = 0;

	formattedResponse.forEach((log: { action: string }) => {
		if (log.action.startsWith("on_")) {
			nodes.push({
				id: `${transaction_id}-${log.action}`,
				position: { x: initialX, y: 300 },
				data: { title: log.action, log: log },
				type: "custom",
			});
		} else {
			initialX += 100;
			nodes.push({
				id: `${transaction_id}-${log.action}`,
				position: { x: initialX, y: 100 },
				data: { title: log.action, log: log },
				type: "custom",
			});
		}
		if (
			formattedResponse.filter(
				(e: { action: string }) =>
					e.action === PREV_ACTION[log.action as keyof typeof PREV_ACTION]
			).length > 0
		) {
			edges.push({
				id: `e-${transaction_id}-${
					PREV_ACTION[log.action as keyof typeof PREV_ACTION]
				}-${log.action}`,
				source: `${transaction_id}-${
					PREV_ACTION[log.action as keyof typeof PREV_ACTION]
				}`,
				target: `${transaction_id}-${log.action}`,
				type: "custom",
				markerEnd: {
					type: MarkerType.Arrow,
					color: theme.palette.primary.dark,
				},
				animated: log.action.startsWith("on_") ? true : false,
			});
		}
	});
	return { nodes, edges };
};


type CopyCallbackFn = () => void;

export const copyToClipboard = (body: object, callback?: CopyCallbackFn) => {
	navigator.clipboard
		.writeText(JSON.stringify(body))
		.then(() => {
			if (callback) callback();
		})
		.catch((err) => {
			console.log(err.message);
		});
};