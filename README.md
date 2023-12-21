# ONDC NP Mock Server
This server is supposed to mock network participants and provide sample logs for better integration and onboarding to the network. 

## How it works:
 - If a B2B Buyer app NP is using this server, then an example of usage could be to mock a B2B seller app NP (BPP). Requests to `/api/b2b/bpp/*` would simulate requests that can be sent to B2B BPP. The response would have two properties `sync` and `async`. The `sync` property would be the response received immediately from BPP to signify the acknowledgement while the `async` property would denote the `on_<action>` response.

## Current Mock Status:
1. B2B BPP - **Done**
2. B2B BAP - In-Progress

## Steps to Run:
1. Clone the Repo, move into the project root and run `npm i`.
2. To run the mock server in dev mode, run `npm run dev`.