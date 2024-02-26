import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Mock, Sandbox, Swagger } from "./pages";
import { B2BSwagger } from "./pages/swagger/domains";
import { MockProvider, SandboxProvider } from "./utils/context";
import { B2BMock } from "./pages/mock/domains";
import { B2BSandbox } from "./pages/sandbox/domains";
import { Landing } from "./pages/landing";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				path: "/",
				Component: Landing
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
				],
			},
			{
				path: "/swagger",
				Component: Swagger,
				children: [{ path: "b2b", Component: B2BSwagger }],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
