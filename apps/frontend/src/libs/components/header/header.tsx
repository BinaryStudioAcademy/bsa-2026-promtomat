import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import {
	LoaderSize,
	LoaderVariant,
} from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useSignOut } from "~/modules/auth/auth.js";
import { type UserDto } from "~/modules/users/users.js";

import styles from "./styles.module.css";

type Properties = {
	isLoading: boolean;
	user: null | UserDto;
};

const Header: React.FC<Properties> = ({ isLoading, user }: Properties) => {
	const signOut = useSignOut();

	const handleSignOut = useCallback((): void => {
		void signOut();
	}, [signOut]);

	return (
		<header className={styles["header"]}>
			<Logo />

			<nav aria-label="Main navigation">
				<ul className={styles["navigation"]}>
					{isLoading && (
						<li>
							<Loader
								label="Loading navigation"
								size={LoaderSize.SMALL}
								variant={LoaderVariant.INLINE}
							/>
						</li>
					)}
					{!isLoading && user && (
						<>
							<li>
								<Link to={AppRoute.ROOT}>Root</Link>
							</li>
							<li>{user.email}</li>
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
