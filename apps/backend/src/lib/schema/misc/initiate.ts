export const initiateTransactionSchema = {
	id: "initiateTransaction",
	type: "object",
	properties: {
		transaction_id: {
			type: "string",
			example: "d83816b4-5b9a-4da9-9c18-242cc144da07",
		},
		bpp_uri: {
			type: "string",
			example: "https://mock.ondc.org/api/b2b/bpp",
		},
		city: {
			type: "object",
			properties: {
				code: {
					type: "string",
					enum: ["std:080", "std:011"],
				},
			},
		},
		domain: {
			type: "string",
			enum: [
				"ONDC:RET1A",
				"ONDC:RET1B",
				"ONDC:RET1C",
				"ONDC:RET1D",
				"ONDC:RET10",
				"ONDC:RET12",
				"ONDC:RET13",
				"ONDC:RET14",
			],
		},
	},
};
