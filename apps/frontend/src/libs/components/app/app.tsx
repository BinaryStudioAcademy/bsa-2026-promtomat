import { Outlet as RouterOutlet } from "react-router-dom";

import { Header } from "~/libs/components/header/header.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";

const App: React.FC = () => {
	useRedirect();

	return (
		<>
			<Header />
			<main>
				<RouterOutlet />
			</main>
		</>
	);
};

export { App };
