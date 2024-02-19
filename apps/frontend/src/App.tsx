import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Mock, Sandbox, Swagger } from "./pages";
import { B2B } from "./pages/swagger/domains";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{ path: "/", Component: Mock },
			{ path: "/sandbox", Component: Sandbox },
			{ path: "/swagger", Component: Swagger, children: [
				{ path: "b2b", Component: B2B}
			] },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
