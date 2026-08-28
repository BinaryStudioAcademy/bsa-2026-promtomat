import { Outlet as RouterOutlet, useLocation } from "react-router-dom";

import reactLogo from "~/assets/img/react.svg";
import { Link } from "~/libs/components/link/link.js";
import { OverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useGetUsersQuery } from "~/modules/users/users-api.js";

const App: React.FC = () => {
	const { pathname } = useLocation();

	const isRoot = pathname === AppRoute.ROOT;

	const {
		data: users,
		error,
		isLoading,
	} = useGetUsersQuery(undefined, { skip: !isRoot });

	return (
		<OverlayHost>
			<img alt="logo" className="App-logo" src={reactLogo} width="30" />

			<ul className="App-navigation-list">
				<li>
					<Link to={AppRoute.ROOT}>Root</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_IN}>Sign in</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_UP}>Sign up</Link>
				</li>
			</ul>
			<p>Current path: {pathname}</p>

			<div>
				<RouterOutlet />
			</div>
			{isRoot && (
				<>
					<h2>Users:</h2>
					{isLoading && <p>Loading...</p>}
					{error && <p>{error.message}</p>}
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
