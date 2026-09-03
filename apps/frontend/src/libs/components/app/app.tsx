import { Outlet as RouterOutlet, useLocation } from "react-router-dom";

import { Header } from "~/libs/components/header/header.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { OverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { useGetUsersQuery } from "~/modules/users/users-api.js";

const App: React.FC = () => {
	const { pathname } = useLocation();

	useRedirect();

	const isRoot = pathname === AppRoute.ROOT;

	const { data: authenticatedUser, isLoading: isAuthenticatedUserLoading } =
		useGetAuthenticatedUserQuery(undefined);

	const { data: users, isLoading: isUsersLoading } = useGetUsersQuery(
		undefined,
		{ skip: !isRoot },
	);

	return (
		<OverlayHost>
			<Header
				isLoading={isAuthenticatedUserLoading}
				user={authenticatedUser ?? null}
			/>
			<RouterOutlet />
			{isRoot && (
				<>
					<h2>Signed in as</h2>
					{authenticatedUser && <p>{authenticatedUser.email}</p>}

					<h2>All users</h2>
					{isUsersLoading && (
						<Loader label="Loading users" variant={LoaderVariant.SECTION} />
					)}
					<ul>
						{users?.items.map((user) => (
							<li key={user.id}>{user.email}</li>
						))}
					</ul>
				</>
			)}
		</OverlayHost>
	);
};

export { App };
