export const HOUR24 = 24 * 60 * 60 * 1000;

export const REGISTRY_URL = "https://preprod.registry.ondc.org/ondc/lookup";

export const ACTIONS = {
	search: "search",
	select: "select",
	init: "init",
	confirm: "confirm",
	update: "update",
	status: "status",
	cancel: "cancel",
	next: {
		search: "on_search",
		on_search: "select",
		select: "on_select",
		on_select: "init",
		init: "on_init",
		on_init: "confirm",
		confirm: "on_confirm",
		update: "on_update",
		status: "on_status",
		cancel: "on_cancel"
	}
};

export const MOCKSERVER_ID = "b2b.ondc-mockserver.com";
export const MOCKSERVER_URL = "b2b.ondc-mockserver.com/uri";
