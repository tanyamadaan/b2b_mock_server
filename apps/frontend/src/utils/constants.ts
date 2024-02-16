export const SWAGGER_BUILD_LINK =
	"https://raw.githubusercontent.com/abhik-wil/b2b_mock_server/feat-monorepo/apps/backend/src/openapi/build/swagger.yaml";
export const URL_MAPPING = {
	bpp: ["search", "select", "init", "confirm", "update", "status", "cancel"],
	bap: [
		"on_search",
		"on_select",
		"on_init",
		"on_confirm",
		"on_update",
		"on_status",
		"on_cancel",
	],
};

export const NEXT_ACTION = {
	search: "on_search",
	on_search: "select",
	select: "on_select",
	on_select: "init",
	init: "on_init",
	on_init: "confirm",
	confirm: "on_confirm",
	update: "on_update",
	status: "on_status",
	cancel: "on_cancel",
};

export const SCENARIOS = {
	select: [
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Domestic Self-Pickup",
			scenario: "domestic-self-pickup",
		},
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
		{
			name: "BAP Chat",
			scenario: "bap-chat",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
	],
	on_select: [
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Domestic Self-Pickup",
			scenario: "domestic-self-pickup",
		},
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
		{
			name: "Non Serviceable",
			scenario: "non-serviceable",
		},
		{
			name: "Quantity Unavailable",
			scenario: "quantity-unavailable",
		},
	],
	init: [
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
		{
			name: "Domestic BPP Payment",
			scenario: "domestic-bpp-payment",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
	],
	on_init: [
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
		{
			name: "Domestic Payment BPP Non-RFQ",
			scenario: "domestic-payment-bpp-non-rfq",
		},
		{
			name: "Domestic Self-Pickup",
			scenario: "domestic-self-pickup",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
		{
			name: "Reject RFQ",
			scenario: "reject-rfq",
		},
	],
	confirm: [
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
	],
	on_confirm: [
		{
			name: "Domestic Non-RFQ",
			scenario: "domestic-non-rfq",
		},
		{
			name: "Domestic Rejected",
			scenario: "domestic-rejected",
		},
		{
			name: "Domestic",
			scenario: "domestic",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
	],
	on_status: [
		{
			name: "BPP Payment",
		},
		{
			name: "BPP Payment Error",
		},
		{
			name: "Delivered",
			scenario: "delivered",
		},
		{
			name: "Out for Delivery",
			scenario: "out-for-delivery",
		},
		{
			name: "Pickup Up",
			scenario: "picked-up",
		},
		{
			name: "Proforma Invoice",
			scenario: "proforma-invoice",
		},
		{
			name: "Self Pickup-up",
		},
	],
	on_update: [
		{
			name: "Fulfillments",
			scenario: "fulfillment",
		},
		{
			name: "Prepaid BAP",
		},
		{
			name: "Prepaid",
			scenario: "prepaid",
		},
	],
};
