import { Outlet as RouterOutlet, useLocation } from "react-router-dom";

import reactLogo from "~/assets/img/react.svg";
import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";
import { useGetUsersQuery } from "~/modules/users/users-api.js";

const App: React.FC = () => {
	const { pathname } = useLocation();

	useRedirect();

	const isRoot = pathname === AppRoute.ROOT;

	const {
		data: users,
		error,
		isLoading,
	} = useGetUsersQuery(undefined, { skip: !isRoot });

	return (
		<>
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
					{isLoading && (
						<Loader label="Loading users" variant={LoaderVariant.SECTION} />
					)}
					{error && <p>{error.message}</p>}
					<ul>
						{users?.items.map((user) => (
							<li key={user.id}>{user.email}</li>
						))}
					</ul>
				</>
			)}
		</>
	);
};

export { App };
