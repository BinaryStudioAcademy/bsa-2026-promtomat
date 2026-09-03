import { Outlet as RouterOutlet, useLocation } from "react-router-dom";

import { Header } from "~/libs/components/header/header.js";
import { OverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { checkIsAuthPath } from "~/libs/helpers/helpers.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

const App: React.FC = () => {
	useRedirect();

	const { pathname } = useLocation();
	const isAuthRoute = checkIsAuthPath(pathname);

	const { data: user, isLoading } = useGetAuthenticatedUserQuery(undefined, {
		skip: isAuthRoute,
	});

	return (
		<OverlayHost>
			{!isAuthRoute && <Header isLoading={isLoading} user={user ?? null} />}
			<main>
				<RouterOutlet />
			</main>
		</OverlayHost>
	);
};

export { App };
