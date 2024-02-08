
import { CustomDrawer } from "./components";
import { Mock, Sandbox } from "./pages";

function App() {
	return (
		<>
			<CustomDrawer>
				<Mock />
				<Sandbox />
			</CustomDrawer>
		</>
	);
}

export default App;
