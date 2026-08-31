import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { useSignOut } from "~/modules/auth/auth.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	const { pathname } = useLocation();
	const isPublicRoute =
		pathname === AppRoute.SIGN_IN || pathname === AppRoute.SIGN_UP;

	const { data: user, isLoading } = useGetAuthenticatedUserQuery(undefined, {
		skip: isPublicRoute,
	});

	const signOut = useSignOut();

	const handleSignOut = useCallback((): void => {
		void signOut();
	}, [signOut]);

	return (
		<header className={styles["header"]}>
			<Logo />

			<nav aria-label="Main navigation">
				<ul className={styles["navigation"]}>
					{user && (
						<>
							<li>
								<Link to={AppRoute.ROOT}>Root</Link>
							</li>
							<li>
								<Button
									label="Sign out"
									onClick={handleSignOut}
									type="button"
								/>
							</li>
						</>
					)}
					{!isLoading && !user && (
						<>
							<li>
								<Link to={AppRoute.SIGN_IN}>Sign in</Link>
							</li>
							<li>
								<Link to={AppRoute.SIGN_UP}>Sign up</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export { Header };
