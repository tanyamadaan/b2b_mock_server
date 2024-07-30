import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Analyse, Landing, Mock, Sandbox, Sign, Swagger } from "./pages";
import {
	AgriServicesSwagger,
	AuthSwagger,
	B2BSwagger,
	B2CSwagger,
	HealthCareServicesSwagger,
	MiscSwagger,
	ServicesSwagger,
} from "./pages/swagger/domains";
import {
	AnalyseProvider,
	MessageProvider,
	MockProvider,
	SandboxProvider,
} from "./utils/context";
import { AgriServicesMock, B2BMock, HealthCareServicesMock, ServicesMock } from "./pages/mock/domains";
import { B2BSandbox, ServicesSandbox, LogisticsSandbox } from "./pages/sandbox/domains";
import { AgriServicesSandbox } from "./pages/sandbox/domains/agri-services";
import { HealthCareServicesSandbox } from "./pages/sandbox/domains/healthcare-services";
import Readme from "./pages/readme";
import { AgriEquipmentServicesSandbox } from "./pages/sandbox/domains/agri-equipment-services";
import { AgriEquipmentServicesMock } from "./pages/mock/domains/agri-equipment-services";
import { AgriEquipmentHiringSwagger } from "./pages/swagger/domains/agri-equipment-hiring";
import { B2CMock } from "./pages/mock/domains/b2c";
import { B2CSandbox } from "./pages/sandbox/domains/b2c";
import { LogisticsMock } from "./pages/mock/domains/logistics";
import { LogisticsSwagger } from "./pages/swagger/domains/logistics";

// log

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				path: "/",
				Component: Landing,
			},
			{
				path: "/user-guide",
				Component: Readme,
			},
			{
				path: "/sign-check",
				Component: Sign,
			},
			{
				path: "/mock",
				Component: () => (
					<MockProvider>
						<Mock />
					</MockProvider>
				),
				children: [
					{
						path: "b2b",
						Component: B2BMock,
					},
					{
						path: "b2c",
						Component: B2CMock,
					},
					{
						path: "services",
						Component: ServicesMock,
					},
					{
						path: "agri-services",
						Component: AgriServicesMock,
					},
					{
						path: "healthcare-services",
						Component: HealthCareServicesMock,
					},
					{
						path:"agri-equipment-services",
						Component:AgriEquipmentServicesMock
					},
					{
						path: "logistics",
						Component: LogisticsMock
					}
				],
			},
			{
				path: "/sandbox",
				Component: () => (
					<SandboxProvider>
						<Sandbox />
					</SandboxProvider>
				),
				children: [
					{
						path: "b2b",
						Component: B2BSandbox,
					},
					{
						path: "b2c",
						Component: B2CSandbox,
					},
					{
						path: "services",
						Component: ServicesSandbox,
					},
					{
						path: "agri-services",
						Component: AgriServicesSandbox,
					},
					{
						path: "healthcare-services",
						Component: HealthCareServicesSandbox,
					},
					{
						path: "agri-equipment-services",
						Component: AgriEquipmentServicesSandbox,
					},
					{
						path: "logistics",
						Component: LogisticsSandbox,
					}
				],
			},
			{
				path: "/swagger",
				Component: Swagger,
				children: [
					{ path: "b2b", Component: B2BSwagger },
					{
						path: "b2c",
						Component: B2CSwagger,
					},
					{ path: "services", Component: ServicesSwagger },
					{ path: "agri-services", Component: AgriServicesSwagger },
					{ path: "healthcare-services", Component: HealthCareServicesSwagger },
					{ path: "agri-equipment-services", Component: AgriEquipmentHiringSwagger },
					{ path: "auth", Component: AuthSwagger },
					{ path: "misc", Component: MiscSwagger },
					{ path: "logistics", Component: LogisticsSwagger}
				],
			},
			{
				path: "/analyse",
				Component: () => (
					<AnalyseProvider>
						<Analyse />
					</AnalyseProvider>
				),
			},
		],
	},
]);

export default function App() {
	return (
		<MessageProvider>
			<RouterProvider router={router} />
		</MessageProvider>
	);
}
