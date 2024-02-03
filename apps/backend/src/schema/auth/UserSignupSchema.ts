import { JSONSchemaType } from "ajv";

interface UserLocalSignup {
	email: string;
	password: string;
	org: string;
}

export const userSignupSchema: JSONSchemaType<UserLocalSignup> = {
	type: "object",
	properties: {
		email: {
			type: "string",
		},
		password: {
			type: "string",
		},
		org: {
			type: "string",
		},
	},

	required: ["email", "password", "org"],
	additionalProperties: false,
};
