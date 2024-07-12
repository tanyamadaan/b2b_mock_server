import app from "../../../index";
import request from "supertest";
import {
	B2B_BAP_MOCKSERVER_URL,
	createAuthHeader,
	MOCKSERVER_ID,
} from "../../../lib/utils";
import searchByCategory from "../../../../domain-repos/@retail-b2b/release-2.0.2/api/components/Examples/B2B_json/search/search_by_category.json";
import selectDomestic from "../../../../domain-repos/@retail-b2b/release-2.0.2/api/components/Examples/B2B_json/select/select_domestic.json";

describe("B2B Tests", () => {
	it("Should pass auth test", async () => {
		const REQ_BODY = searchByCategory;
		REQ_BODY.context.bap_id = MOCKSERVER_ID;
		REQ_BODY.context.bap_uri = B2B_BAP_MOCKSERVER_URL;
		const header = await createAuthHeader(REQ_BODY);
		console.log("HEADER", header);
		console.log("REQ Body", REQ_BODY);
		const res = await request(app)
			.post("/auth/signCheck")
			.send(REQ_BODY)
			.set({ authorization: header });
		expect(res.body.message).toBe("Valid Signature");
	});

	it("Should respond with ACK on /search", async () => {
		const reqBody = searchByCategory;
		reqBody.context = {
			...reqBody.context,
			bap_id: MOCKSERVER_ID,
			bap_uri: `http://localhost:3000`,
		};
		const header = await createAuthHeader(reqBody);
		const res = await request(app)
			.post("/b2b/bpp/search")
			.send(reqBody)
			.set({ authorization: header, mode: "mock" });
		expect(res.body.message).toEqual({ ack: { status: "ACK" } });
	});

	// it("Should respond with ACK on /select", async () => {
	// 	const reqBody = selectDomestic;
	// 	reqBody.context = {
	// 		...reqBody.context,
	// 		bap_id: MOCKSERVER_ID,
	// 		bap_uri: B2B_BAP_MOCKSERVER_URL,
	// 	};
	// 	const header = await createAuthHeader(reqBody);
	// 	const res = await request(app)
	// 		.post("/b2b/bpp/select")
	// 		.send(reqBody)
	// 		.set({ authorization: header });
	// 	console.log("Response", res.body);
	// 	expect(res.body.message).toEqual({ ack: { status: "ACK" } });
	// });
});
