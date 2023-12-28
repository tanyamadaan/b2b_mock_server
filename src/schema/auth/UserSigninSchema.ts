import { JSONSchemaType } from "ajv";

interface UserLocalSignin {
	email: string;
	password: string;
}

export const userSigninSchema: JSONSchemaType<UserLocalSignin> = {
	type: "object",
	properties: {
		email: {
			type: "string",
		},
		password: {
			type: "string",
		}
	},

	required: ["email", "password"],
	additionalProperties: false,
};
