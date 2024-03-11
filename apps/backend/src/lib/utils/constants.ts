export const HOUR24 = 24 * 60 * 60 * 1000;

export const REGISTRY_URL = "https://staging.registry.ondc.org/lookup";

export const SERVICES_EXAMPLES_PATH = "./domain-repos/@services/draft-services/api/components/Examples/Services_home_service_yaml"
export const B2B_EXAMPLES_PATH = "./domain-repos/@retail-b2b/draft-2.x/api/components/Examples/B2B"

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
export const B2B_SCENARIOS = {
	select: [
		{
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Self-Pickup",
			scenario: "self-pickup",
		},
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
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
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Self-Pickup",
			scenario: "self-pickup",
		},
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
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
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
		},
		{
			name: "BPP Payment",
			scenario: "bpp-payment",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
	],
	on_init: [
		{
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
		},
		{
			name: "Payment BPP Non-RFQ",
			scenario: "payment-bpp-non-rfq",
		},
		{
			name: "Self-Pickup",
			scenario: "self-pickup",
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
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
		},
	],
	on_confirm: [
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
		},
		{
			name: "Rejected",
			scenario: "rejected",
		},
		{
			name: "RFQ",
			scenario: "rfq",
		},
		{
			name: "Exports",
			scenario: "exports",
		},
	],
	on_status: [
		{
			name: "BPP Payment",
			scenario: "bpp-payment"
		},
		{
			name: "BPP Payment Error",
			scenario: "bpp-payment-error"
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
			name: "Self Pickup",
			scenario: "self-picked-up"
		},
	],
	on_update: [
		{
			name: "Fulfillments",
			scenario: "fulfillment",
		},
		{
			name: "Prepaid BAP",
			scenario: "prepaid-bap"
		},
		{
			name: "Prepaid",
			scenario: "prepaid",
		},
	],
};

export const MOCKSERVER_ID = "https://mock.ondc.org/api";
export const MOCKSERVER_URL = "https://mock.ondc.org/api";
