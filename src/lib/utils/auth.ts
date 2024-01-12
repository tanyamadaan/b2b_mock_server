import _sodium from "libsodium-wrappers";
import { Request, Response } from "express";
import { NetworkPaticipantType, SubscriberDetail } from "../../interfaces";
import { getSubscriberDetails } from "./lookup";
import { createSigningString, verifyMessage } from "./crypto";

const remove_quotes = (value: string) => {
	if (
		value.length >= 2 &&
		value.charAt(0) == '"' &&
		value.charAt(value.length - 1) == '"'
	) {
		value = value.substring(1, value.length - 1);
	}
	return value;
};

const split_auth_header = (auth_header: string) => {
	const header = auth_header.replace("Signature ", "");
	let re = /\s*([^=]+)=([^,]+)[,]?/g;
	let m;
	let parts: any = {};
	while ((m = re.exec(header)) !== null) {
		if (m) {
			parts[m[1]] = remove_quotes(m[2]);
		}
	}
	return parts;
};

export async function getSenderDetails(
	header: string
): Promise<SubscriberDetail> {
	try {
		console.log(`Header recieved from bpp: ${JSON.stringify(header)}`);
		const parts = split_auth_header(header);
		if (!parts || Object.keys(parts).length === 0) {
			throw new Error("Header parsing failed");
		}

		const subscriber_id = parts["keyId"].split("|")[0] as string;
		const unique_key_id = parts["keyId"].split("|")[1] as string;

		const {
			unique_key_id: uki,
			type,
			...subscriber_details
		} = await getSubscriberDetails(subscriber_id, unique_key_id);
		return {
			...subscriber_details,
			subscriber_url: uki,
			type: type as NetworkPaticipantType,
		};
	} catch (error) {
		console.log("ERROR:", error);
		throw error;
	}
}

export async function verifyHeader(
	header: string,
	req: Request,
	res: Response
): Promise<boolean> {
	try {
		const parts = split_auth_header(header);
		if (!parts || Object.keys(parts).length === 0) {
			return false
		}

		const subscriber_id = parts["keyId"].split("|")[0];
		const unique_key_id = parts["keyId"].split("|")[1];
		const subscriber_details = await getSubscriberDetails(
			subscriber_id,
			unique_key_id
		);
		console.log(req.body?.context?.transaction_id, subscriber_details);
		const public_key = subscriber_details.signing_public_key;
		const { signing_string } = await createSigningString(
			res.locals.rawBody,
			parts["created"],
			parts["expires"]
		);
		const verified = await verifyMessage(
			parts["signature"],
			signing_string,
			public_key
		);
		return verified;
	} catch (error) {
		console.log("ERROR:", error);
		return false;
	}
}
