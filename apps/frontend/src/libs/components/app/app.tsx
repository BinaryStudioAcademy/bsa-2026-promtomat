import { Outlet as RouterOutlet, useLocation } from "react-router-dom";

import reactLogo from "~/assets/img/react.svg";
import { Link } from "~/libs/components/link/link.js";
import { OverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useRedirect } from "~/libs/hooks/use-redirect/use-redirect.hook.js";
import { useGetUsersQuery } from "~/modules/users/users-api.js";

import styles from "./styles.module.css";

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
		<OverlayHost>
			<header className={styles["header"]}>
				<img alt="logo" src={reactLogo} width="30" />
				<ul className={styles["nav"]}>
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
			</header>

			<RouterOutlet />
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
