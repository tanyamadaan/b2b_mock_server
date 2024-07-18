export const VERSION = "2.0.0";

export const DOMAIN = ["ONDC:SRV11","ONDC:SRV13","ONDC:SRV14","ONDC:SRV15"];

export const SRV_FULFILLMENT_TYPE = ["Home-Service", "Store-Service","Seller-Fulfilled", "Buyer-Fulfilled"];

export const SRV_INTENT_TAGS = ["finder_fee_type","finder_fee_amount","FINDER_FEE_TYPE","FINDER_FEE_AMOUNT","BAP_TYPE","BAP_TERMS"];

export const SRV_PAYMENT_TYPE = [
	"PRE-FULFILLMENT",
	"ON-FULFILLMENT",
	"POST-FULFILLMENT",
];

export const SRV_FULFILLMENT_STATE = [
	"Pending",
	"At-Location",
	"In-Transit",
	"Completed",
	"Cancelled",
];

export const SRV_ORDER_STATE = [
	"Created",
	"Accepted",
	"In-progress",
	"Completed",
	"Cancelled",
	"Pending",
];

export const GPS_PATTERN =
	"^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$";

export const SERVICEABILITY = ["location", "category", "type", "val", "unit"];

export const RESCHEDULE_TERMS = [
	"fulfillment_state",
	"reschedule_eligible",
	"reschedule_fee",
	"reschedule_within",
];

export const PAYMENT_COLLECTEDBY = ["BAP", "BPP"];
