import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const ONDCDocumentation = () => {
	const coloredJsonString = (jsonString: unknown) => {
		return JSON.stringify(jsonString, null, 2).replace(
			/(".*?": )(".*?")|(\b\d+\b)/g,
			(match, p1, p2) => {
				if (p1 && p2) {
					// Match for string values
					return `<span style="color: blue;">${p1}</span><span style="color: green;">${p2}</span>`;
				} else if (!p1 && !p2) {
					// Match for numbers
					return `<span style="color: red;">${match}</span>`;
				}
				return match;
			}
		);
	};

	// State to hold the text value

	const handleCopyText = (text: unknown) => {
		console.log("🚀 ~ handleCopyText ~ text:", text);

		navigator.clipboard.writeText(JSON.stringify(text)); // Copy text to clipboard
	};

	return (
		<Container
			maxWidth="lg"
			sx={{
				paddingBottom: "20px", 
			}}
		>
			<div>
				<h1>ONDC Mock & Sandbox</h1>
				<p>
					To facilitate the development and testing of Buyer Network
					participants or Seller network participants. It provides a simulated
					environment where developers can test, and validate their integrations
					without the need for a counterparty network participant.
				</p>

				<h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
					How to use
				</h2>
				<p>
					To start, first you have to ask yourself two things. "To which service
					I am making requests to(BAP or BPP)?" and "what would be the
					action/on_action I am going to use". With these you can easily
					construct the URL you need to mock and then find that among this list.
				</p>
				<i>NOTE: Currently mocker server supports only B2B and Services.</i>
				{/* Add more details about the mock server */}

				<h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
					Steps to Run:
				</h2>
				<p>
					There are 2 domains that you can test.
					<ol>
						<li>B2B</li>
						<li>Services</li>
					</ol>
					<h4>
						To start testing your buyer or seller application , follow these
						steps:{" "}
					</h4>
					<ol>
						<li>
							Select Domain Type:
							<ul>
								<li>
									From the navigation menu, choose the type of domain you want
									to test.
								</li>
							</ul>
						</li>
						<li>
							Choose Service Type:
							<ul>
								<li>Select the specific service you want to avail.</li>
							</ul>
						</li>
						<li>
							If you want to initiate Seller Testing:
							<ul>
								<li>
									You have two options for initiating seller testing:
									<ul>
										<li>
											<b>From Sandbox:</b> Initiate the request directly from
											the sandbox environment.
										</li>
										<li>
											<b>Upload Payload:</b> Alternatively, you can upload your
											own payload for testing.
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							Analyze Transaction: :
							<ul>
								<li>Copy the transaction ID provided.</li>
								<li>
									Paste the transaction ID into the Transaction Analyzer
									section.
								</li>
								<li>
									Here, you can visualize the complete flow and view the
									payloads with their validation checks.
								</li>
							</ul>
						</li>
					</ol>
				</p>
				{/* Add more details about the sandbox */}

				<h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
					Servers
				</h2>
				<p>
					There are two type of NPs one is BPP(Seller app) and BAP(Buyer app).
				</p>
				<ul>
					<li>
						All the actions calls are hosted on the BPP server. So if you want
						to make mock requests to BPP, then select /b2b/bpp from the servers
						dropdown.
					</li>
					<li>
						All the on_actions calls are hosted on the BAP server. So if you
						want make mock requests to BAP or the buyer app, then select
						/b2b/bap from the servers dropdown.
					</li>
				</ul>
				{/* Add more details about using Swagger */}
				<h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
					Make a request
				</h2>
				<p>
					Since you have selected the desired server, now you can make the
					requests to that server. There are two serivces available to test with
					:
				</p>
				<ul>
					<li>SandBox</li>
					<li>Mock</li>
				</ul>
				<p>You can select service from mode dropdown.</p>
				<h3>Sandbox</h3>
				<p>
					To use the sandbox you need to have an authorization header which is
					to be passed in the header to make requests. For creating the
					authorization header you can refer this{" "}
					<a href="https://docs.google.com/document/d/1brvcltG_DagZ3kGr1ZZQk4hG4tze3zvcxmGV4NMTzr8/edit?pli=1#heading=h.hdylqyv4bn12">
						document
					</a>{" "}
				</p>
				<h3>Mock</h3>
				<p>
					You can use Mock service to mock the requests. It doesn't require
					authorization header to be passed.
				</p>
				<h3>Request body</h3>
				<p>You can refer these examples for request body.</p>
				<p>
					Note: All the requests must pass the schema validation based on the
					examples. You can refer this log utility for the schema validations.
				</p>
				<h3>Response body</h3>
				<ol>
					<li>
						In the case of schema validation failure, you will receive a NACK. A
						sample NACK response is as below:
						<Container maxWidth="lg">
							<div
								style={{
									whiteSpace: "pre-wrap",
									marginBottom: "10px",
									width: "60%",
									border: "1px solid #ccc",
									padding: "10px",
									borderRadius: "4px",
									backgroundColor: "#f4f4f4",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
								}}
							>
								<pre
									dangerouslySetInnerHTML={{
										__html: coloredJsonString({
											message: {
												ack: {
													status: "NACK",
												},
											},
											error: {
												type: "JSON-SCHEMA-ERROR",
												code: "50009",
												message: [
													{
														message: "must have required property 'domain'",
													},
												],
											},
										}),
									}}
								/>
								<IconButton
									aria-label="Copy"
									onClick={() =>
										handleCopyText({
											message: {
												ack: {
													status: "NACK",
												},
											},
											error: {
												type: "JSON-SCHEMA-ERROR",
												code: "50009",
												message: [
													{
														message: "must have required property 'domain'",
													},
												],
											},
										})
									}
								>
									<FileCopyIcon />
								</IconButton>
							</div>
						</Container>
					</li>
					<li>
						In the case of schema validation success
						<Container maxWidth="lg">
							<div
								style={{
									whiteSpace: "pre-wrap",
									marginBottom: "10px",
									width: "60%",
									border: "1px solid #ccc",
									padding: "10px",
									borderRadius: "4px",
									backgroundColor: "#f4f4f4",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
								}}
							>
								<pre
									dangerouslySetInnerHTML={{
										__html: coloredJsonString({
											message: {
												ack: {
													status: "ACK",
												},
											},
										}),
									}}
								/>
								<IconButton
									aria-label="Copy"
									onClick={() =>
										handleCopyText({
											message: {
												ack: {
													status: "ACK",
												},
											},
										})
									}
								>
									<FileCopyIcon />
								</IconButton>
							</div>
						</Container>
					</li>
				</ol>
				{/* Add more details about using Swagger */}
				<h2 style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
					CURL request
				</h2>
				<p>
					You can also make curl to directly make requests to sandbox
					environments.
				</p>
				<p>
					Curl host for Buyer instance: https://ret-mock.ondc.org/api/b2b/bap
				</p>
				<p>
					Curl host for Seller instance: https://ret-mock.ondc.org/api/b2b/bpp
				</p>
				{/* Add more details about using Swagger */}
			</div>
		</Container>
	);
};

export default ONDCDocumentation;
