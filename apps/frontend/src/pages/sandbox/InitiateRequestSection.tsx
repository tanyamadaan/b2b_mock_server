import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { B2B_DOMAINS, CITY_CODE, SERVICES_DOMAINS } from "../../utils";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { Input, Option, Select, Button } from "@mui/joy";
import { useState } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
type InitiateRequestSectionProp = {
	domain: "b2b" | "services";
};
export const InitiateRequestSection = ({
	domain,
}: InitiateRequestSectionProp) => {
	const [bppUri, setBppUri] = useState<string>();
	const [trnDomain, setTrnDomain] = useState<string>();
	const [cityCode, setCityCode] = useState<string>();
	const [successfulResponse, setSuccessfulResponse] = useState<boolean>(false);
	const [transactionId, setTransactionId] = useState<string>();

	const handleSubmit = async () => {
		// console.log("Values", bppUri, domain, cityCode);
		setTransactionId(undefined);
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/initiate/${domain}`,
				{
					bpp_uri: bppUri,
					city: {
						code: cityCode,
					},
					domain: trnDomain,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// console.log("Response", response);
			if (response.data.message.ack.status === "ACK") {
				setSuccessfulResponse(true);
				setTransactionId(response.data.transaction_id);
				setTimeout(() => {
					setSuccessfulResponse(false);
				}, 2000);
			}
		} catch (error) {
			console.log("Error occurred", error);
		}
	};
	return (
		<Fade in={true} timeout={2500}>
			<Paper
				sx={{
					width: "100%",
					// height: "100%",
					p: 1,
					px: 2,
					// overflow: "hidden",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" my={1} mr={2}>
						Initiate Search Request:
					</Typography>
					<Fade in={successfulResponse} timeout={800}>
						<CheckCircleIcon color="success" />
					</Fade>
				</Box>

				{transactionId && (
					<>
						<Typography variant="subtitle2" color="text.secondary">
							Your Transaction ID:
						</Typography>
						<Typography variant="subtitle2">{transactionId}</Typography>
					</>
				)}
				<Stack spacing={2} sx={{ my: 2 }}>
					<Input
						fullWidth
						placeholder="Enter your BPP URI..."
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setBppUri(e.target.value)
						}
					/>
					<Select
						placeholder="Select domain..."
						onChange={(
							_event: React.SyntheticEvent | null,
							newValue: string | null
						) => setTrnDomain(newValue as string)}
					>
						{(domain === "b2b" ? B2B_DOMAINS : SERVICES_DOMAINS).map(
							(domain, idx) => (
								<Option value={domain} key={"b2b-" + idx}>
									{domain}
								</Option>
							)
						)}
					</Select>
					<Select
						placeholder="Select city..."
						onChange={(
							_event: React.SyntheticEvent | null,
							newValue: string | null
						) => setCityCode(newValue as string)}
					>
						{CITY_CODE.map((city, idx) => (
							<Option value={city} key={"b2b-city-" + idx}>
								{city}
							</Option>
						))}
					</Select>
				</Stack>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						variant="solid"
						onClick={handleSubmit}
						disabled={!bppUri || !cityCode || !trnDomain}
					>
						Send
					</Button>
				</Box>
			</Paper>
		</Fade>
	);
};
