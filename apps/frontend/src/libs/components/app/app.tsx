import { Outlet as RouterOutlet } from "react-router-dom";

import { OverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";

const App: React.FC = () => {
	useRedirect();

	return (
		<OverlayHost>
			<RouterOutlet />
		</OverlayHost>
	);
};

export { App };
