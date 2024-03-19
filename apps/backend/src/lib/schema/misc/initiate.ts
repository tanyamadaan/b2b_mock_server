export const initiateTransactionSchema = {
	$id: "initiateTransaction",
	type: "object",
	properties: {
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
