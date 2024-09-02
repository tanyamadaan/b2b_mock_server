import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Analyse, Landing, Mock, Sandbox, Sign, Swagger } from "./pages";
import {
	B2BSwagger,
	MiscSwagger,
	ServicesSwagger,
} from "./pages/swagger/domains";
import {
	AnalyseProvider,
	DomainProvider,
	MessageProvider,
	MockProvider,
	SandboxProvider,
} from "./utils/context";
import { B2BMock, ServicesMock } from "./pages/mock/domains";
import { B2BSandbox, ServicesSandbox } from "./pages/sandbox/domains";
import Readme from "./pages/readme";
import { B2CMock } from "./pages/mock/domains/b2c";
import { B2CSandbox } from "./pages/sandbox/domains/b2c";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallbackComponent } from "./components";
import React from "react";

// log

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
				<Layout />
			</ErrorBoundary>
		),
		children: [
			{
				path: "/",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<Landing />{" "}
					</ErrorBoundary>
				),
			},
			{
				path: "/user-guide",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<Readme />{" "}
					</ErrorBoundary>
				),
			},
			{
				path: "/sign-check",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<Sign />{" "}
					</ErrorBoundary>
				),
			},
			{
				path: "/mock",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<MockProvider>
							<Mock />
						</MockProvider>
					</ErrorBoundary>
				),
				children: [
					{
						path: "b2b",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<B2BMock />
							</ErrorBoundary>
						),
					},
					{
						path: "b2c",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<B2CMock />
							</ErrorBoundary>
						),
					},
					{
						path: "services",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<ServicesMock />
							</ErrorBoundary>
						),
					},
				],
			},
			{
				path: "/sandbox",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<SandboxProvider>
							<Sandbox />
						</SandboxProvider>
					</ErrorBoundary>
				),
				children: [
					{
						path: "b2b",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<B2BSandbox />
							</ErrorBoundary>
						),
					},
					{
						path: "b2c",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<B2CSandbox />
							</ErrorBoundary>
						),
					},
					{
						path: "services",
						element: (
							<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
								<ServicesSandbox />
							</ErrorBoundary>
						),
					},
				],
			},
			{
				path: "/swagger/misc",
				element: (
					<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
						<MiscSwagger />
					</ErrorBoundary>
				),
			},
			{
				path: "/swagger",
				Component: Swagger,
				children: [
					{ path: "b2b", Component: B2BSwagger },
					{ path: "b2c", Component: B2BSwagger },
					{ path: "services", Component: ServicesSwagger },
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
			<DomainProvider>
				<ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
					<RouterProvider router={router} />
				</ErrorBoundary>
			</DomainProvider>
		</MessageProvider>
	);
}
