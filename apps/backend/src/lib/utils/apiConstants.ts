export const ALL_DOMAINS = {
	B2B: "b2b",
	SERVICES: "services",
	AGRI_SERVICES: "agri-services",
	HEALTHCARE_SERVICES: "healthcare-service",
};

export const SERVICES_DOMAINS = {
	B2B: "b2b",
	SERVICES: "services",
	AGRI_SERVICES: "ONDC:SRV14",
	HEALTHCARE_SERVICES: "ONDC:SRV13",
};

export const ORDER_STATUS = {
	ACCEPTED:"Accepted",
	CANCELLED: "Cancelled"
}

export const ORDER_CACELLED_BY = {
	CONSUMER: "CONSUMER",
	MERCHANT: "MERCHANT"
}

export const AGRI_HEALTHCARE_STATUS = [
	"IN_TRANSIT",
	"AT_LOCATION",
	"COLLECTED_BY_AGENT",
	"RECEIVED_AT_LAB",
	"TEST_COMPLETED",
	"REPORT_GENERATED",
	"REPORT_SHARED",
];

export const AGRI_HEALTHCARE_STATUS_OBJECT = {
	IN_TRANSIT: "IN_TRANSIT",
	AT_LOCATION: "AT_LOCATION",
	COLLECTED_BY_AGENT: "COLLECTED_BY_AGENT",
	RECEIVED_AT_LAB: "RECEIVED_AT_LAB",
	TEST_COMPLETED: "TEST_COMPLETED",
	REPORT_GENERATED: "REPORT_GENERATED",
	REPORT_SHARED: "REPORT_SHARED",
};

export const FULFILLMENT_TYPES = {
	BUYER_FULFILLED: "Buyer-Fulfilled",
	SELLER_FULFILLED: "Seller-Fulfilled",
};

export const FULFILLMENT_LABELS = {
	CONFIRMED: "confirmed",
	SELECTED: "selected",
	REJECTED: "rejected",
};

export const FULFILLMENT_STATES = {
	SERVICEABLE: "Serviceable",
	PENDING: "Pending",
	CANCELLED: "Cancelled",
	COMPLETED: "Completed",
};

export const SCENARIO = {
	MULTI_COLLECTION: "multi_collection",
};

export const BILLING_DETAILS = {
	name: "ONDC buyer",
	address:
		"22, Mahatma Gandhi Rd, Craig Park Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
	state: {
		name: "Karnataka",
	},
	city: {
		name: "Bengaluru",
	},
	tax_id: "XXXXXXXXXXXXXXX",
	email: "nobody@nomail.com",
	phone: "9886098860",
};

export const FULFILLMENT_START = {
	location: {
		id: "L1",
		descriptor: {
			name: "ABC Laboratory",
		},
		gps: "12.956399,77.636803",
	},

	contact: {
		phone: "9886098860",
		email: "nobody@nomail.com",
	},

	person: {
		name: "Kishan",
	}
};

export const FULFILLMENT_END = {

	location: {
		gps: "12.974002,77.613458",
		address: "My House #, My buildin",
		city: {
			name: "Bengaluru",
		},
		country: {
			code: "IND",
		},
		area_code: "560001",
		state: {
			name: "Karnataka",
		},
	},
	contact: {
		phone: "9886098860",
		email: "nobody@nomail.com",
	},
	person: {
		name: "Rahul",
		age: "40",
		gender: "male",
		tags: [
			{
				descriptor: {
					code: "PATIENT_DETAILS",
				},
				list: [
					{
						descriptor: {
							code: "PI1",
						},
					},
					{
						descriptor: {
							code: "PI2",
						},
					},
					{
						descriptor: {
							code: "CONTACT_PREFERENCE",
						},
						value: "PI2",
					},
				],
			},
			{
				descriptor: {
					code: "PI1",
				},
				list: [
					{
						descriptor: {
							code: "NAME",
						},
						value: "Person1",
					},
					{
						descriptor: {
							code: "GENDER",
						},
						value: "MALE",
					},
					{
						descriptor: {
							code: "AGE",
						},
						value: "30",
					},
					{
						descriptor: {
							code: "MOBILE_NUMBER",
						},
						value: "9999999999",
					},
				],
			},
			{
				descriptor: {
					code: "PI2",
				},
				list: [
					{
						descriptor: {
							code: "NAME",
						},
						value: "Person2",
					},
					{
						descriptor: {
							code: "GENDER",
						},
						value: "FEMALE",
					},
					{
						descriptor: {
							code: "AGE",
						},
						value: "35",
					},
					{
						descriptor: {
							code: "MOBILE_NUMBER",
						},
						value: "9999999999",
					},
				],
			},
		],
	}
};
