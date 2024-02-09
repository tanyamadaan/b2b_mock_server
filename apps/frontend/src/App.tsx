import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Mock, Sandbox } from "./pages";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [

			{ path: "/", Component: Mock },
			{ path: "/sandbox", Component: Sandbox },
		]
	}
]);

export default function App() {
	return <RouterProvider router={router} />;
}
