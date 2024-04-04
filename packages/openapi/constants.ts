export const USER_GUIDE_LINK = "";

export const B2B_SCENARIOS = {
	select: [
		{
			name: "RFQ",
			scenario: "rfq",
		},
		// {
		// 	name: "Self-Pickup",
		// 	scenario: "self-pickup",
		// },
		{
			name: "Non-RFQ",
			scenario: "non-rfq",
		},
		{
			name: "BAP Chat",
			scenario: "bap-chat",
		},
		// {
		// 	name: "Exports",
		// 	scenario: "exports",
		// },
	],
	on_select: [
		// 	{
		// 		name: "RFQ",
		// 		scenario: "rfq",
		// 	},
		{
			name: "Self-Pickup",
			scenario: "self-pickup",
		},
		// {
		// 	name: "Non-RFQ",
		// 	scenario: "non-rfq",
		// },
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
		// {
		// 	name: "RFQ",
		// 	scenario: "rfq",
		// },
		// {
		// 	name: "Non-RFQ",
		// 	scenario: "non-rfq",
		// },
		{
			name: "BPP Payment",
			scenario: "prepaid-bpp-payment",
		},
		// {
		// 	name: "Exports",
		// 	scenario: "exports",
		// },
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
			scenario: "bpp-payment",
		},
		{
			name: "BPP Payment Error",
			scenario: "bpp-payment-error",
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
			scenario: "self-picked-up",
		},
	],
	on_update: [
		{
			name: "Fulfillments",
			scenario: "fulfillment",
		},
		{
			name: "Prepaid BAP",
			scenario: "prepaid-bap",
		},
		{
			name: "Prepaid",
			scenario: "prepaid",
		},
	],
};

export const SERVICES_SCENARIOS = {
	select: [
		// {
		// 	name: "Consultation",
		// 	scenario: "consultation",
		// },
		{
			name: "Selections",
			scenario: "selection",
		},
		// {
		// 	name: "Service",
		// 	scenario: "service",
		// },
		// {
		// 	name: "Without Schedule",
		// 	scenario: "without-schedule",
		// },
	],
	on_select: [
		// {
		// 	name: "Consultation Confirmed",
		// 	scenario: "consultation-confirmed",
		// },
		// {
		// 	name: "Consultation Rejected",
		// 	scenario: "consultation-rejected",
		// },
		// {
		// 	name: "Service Confirmed",
		// 	scenario: "service-confirmed",
		// },
		// {
		// 	name: "Service Rejected",
		// 	scenario: "service-rejected",
		// },
		// {
		// 	name: "NACK",
		// 	scenario: "nack",
		// },
		{
			name: "Schedule Confirmed",
			scenario: "schedule_confirmed",
		},
		{
			name: "Schedule Rejected",
			scenario: "schedule_rejected",
		},
	],
	init: [
		// {
		// 	name: "Consultation",
		// 	scenario: "consultation",
		// },
		{
			name: "Service",
			scenario: "service",
		},
	],
	on_init: [
		// {
		// 	name: "Consultation",
		// 	scenario: "consultation",
		// },
		{
			name: "Service",
			scenario: "service",
		},
	],
	confirm: [
		// {
		// 	name: "Consultation",
		// 	scenario: "consultation",
		// },
		{
			name: "Service",
			scenario: "service",
		},
	],
	on_confirm: [
		// {
		// 	name: "Consultation",
		// 	scenario: "consultation",
		// },
		{
			name: "Service",
			scenario: "service",
		},
	],
	on_status: [
		{
			name: "Completed",
			scenario: "completed",
		},
		{
			name: "In Transit",
			scenario: "in-transit",
		},
		{
			name: "Reached Re-OTP",
			scenario: "reached-re-otp",
		},
		{
			name: "Reached",
			scenario: "reached",
		},
		{
			name: "Service Started",
			scenario: "service-started",
		},
	],
	on_update: [
		{
			name: "Requote",
			scenario: "requote",
		},
		{
			name: "Reschedule",
			scenario: "reschedule",
		},
	],
	on_cancel: [
		{
			name: "ACK",
			scenario: "ack",
		},
		{
			name: "Merchant",
			scenario: "merchant",
		},
	],
};
export const DOMAINS = {
	b2b: "B2B",
	services: "Services - Home Services",
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


export const PREV_ACTION = {
	on_search: "search",
	select: "on_search",
	on_select: "select",
	init: "on_select",
	on_init: "init",
	confirm: "on_init",
	on_confirm: "confirm"
}