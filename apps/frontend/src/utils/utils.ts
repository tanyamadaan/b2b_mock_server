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
	const { nodes: nodeSet, edges: edgeSet } = addPendingNodeAndEdge(
		formattedResponse,
		initialX,
		nodes,
		edges,
		theme
	);
	return { nodeSet, edgeSet };
};

const addPendingNodeAndEdge = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formattedResponse: any,
	initialX: number,
	nodes: Node<CustomNodeData>[],
	edges: Edge[],
	theme: Theme
) => {
	const { transaction_id } = formattedResponse.filter(
		(e: { action: string }) => e.action === "on_search"
	)[0].request.context;
	const actionsPresent: string[] = formattedResponse.map(
		(e: { action: string }) => e.action
	);

	if (
		actionsPresent.includes("on_search") &&
		!actionsPresent.includes("select")
	) {
		const onSearchNode = nodes.filter(
			(node) => node.data.title === "on_search"
		)[0];
		nodes.push({
			id: `${transaction_id}-select`,
			position: {
				x: onSearchNode.position.x + 200,
				y: 100,
			},
			data: { title: "select", toBeSent: true, log: onSearchNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-on_search-select`,
			source: `${transaction_id}-on_search`,
			target: `${transaction_id}-select`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: false,
		});
	}

	if (
		actionsPresent.includes("select") &&
		!actionsPresent.includes("on_select")
	) {
		const selectNode = nodes.filter((node) => node.data.title === "select")[0];
		nodes.push({
			id: `${transaction_id}-on_select`,
			position: {
				x: selectNode.position.x,
				y: 300,
			},
			data: { title: "on_select", toBeSent: true, log: selectNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-select-on_select`,
			source: `${transaction_id}-select`,
			target: `${transaction_id}-on_select`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: true,
		});
	}

	if (
		actionsPresent.includes("on_select") &&
		!actionsPresent.includes("init")
	) {
		initialX += 100;
		const onSelectNode = nodes.filter(
			(node) => node.data.title === "on_select"
		)[0];
		nodes.push({
			id: `${transaction_id}-init`,
			position: {
				x: onSelectNode.position.x + 200,
				y: 100,
			},
			data: { title: "init", toBeSent: true, log: onSelectNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-on_select-init`,
			source: `${transaction_id}-on_select`,
			target: `${transaction_id}-init`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: false,
		});
	}

	if (actionsPresent.includes("init") && !actionsPresent.includes("on_init")) {
		const initNode = nodes.filter((node) => node.data.title === "init")[0];
		nodes.push({
			id: `${transaction_id}-on_init`,
			position: {
				x: initNode.position.x,
				y: 300,
			},
			data: { title: "on_init", toBeSent: true, log: initNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-init-on_init`,
			source: `${transaction_id}-init`,
			target: `${transaction_id}-on_init`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: true,
		});
	}

	if (
		actionsPresent.includes("on_init") &&
		!actionsPresent.includes("confirm")
	) {
		const onInitNode = nodes.filter((node) => node.data.title === "on_init")[0];
		initialX += 100;
		nodes.push({
			id: `${transaction_id}-confirm`,
			position: {
				x: onInitNode.position.x + 200,
				y: 100,
			},
			data: { title: "confirm", toBeSent: true, log: onInitNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-on_init-confirm`,
			source: `${transaction_id}-on_init`,
			target: `${transaction_id}-confirm`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: false,
		});
	}

	if (
		actionsPresent.includes("confirm") &&
		!actionsPresent.includes("on_confirm")
	) {
		const confirmNode = nodes.filter(
			(node) => node.data.title === "confirm"
		)[0];
		nodes.push({
			id: `${transaction_id}-on_confirm`,
			position: {
				x: confirmNode.position.x,
				y: 300,
			},
			data: { title: "on_confirm", toBeSent: true, log: confirmNode.data.log },
			type: "custom",
		});

		edges.push({
			id: `e-${transaction_id}-confirm-on_confirm`,
			source: `${transaction_id}-confirm`,
			target: `${transaction_id}-on_confirm`,
			type: "custom",
			markerEnd: {
				type: MarkerType.Arrow,
				color: theme.palette.primary.dark,
			},
			animated: true,
		});
	}

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