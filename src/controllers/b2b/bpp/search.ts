import { Request, Response } from "express";
import {
	onSearch,
	onSearchBpc,
	onSearchElectronics,
	onSearchFashion,
	onSearchGrocery,
} from "../../../lib/examples";
import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const searchController = (req: Request, res: Response) => {
	const domain = req.body.context.domain;

	return responseBuilder(
		res,
		req.body.context,
		domain === "ONDC:RET13"
			? onSearchBpc.message
			: domain === "ONDC:RET14"
			? onSearchElectronics.message
			: domain === "ONDC:RET12"
			? onSearchFashion.message
			: domain === "ONDC:RET10"
			? onSearchGrocery.message
			: onSearch.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.search}`,
		`on_${ACTIONS.search}`
	);
};
