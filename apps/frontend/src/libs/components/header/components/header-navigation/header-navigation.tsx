import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";
import { useSignOut } from "~/modules/auth/auth.js";
import { type UserDto } from "~/modules/users/users.js";

import styles from "../../styles.module.css";

type Properties = {
	isLoading: boolean;
	user: null | UserDto;
};

const HeaderNavigation: React.FC<Properties> = ({
	isLoading,
	user,
}: Properties) => {
	const signOut = useSignOut();

	const handleSignOut = useCallback((): void => {
		void signOut();
	}, [signOut]);

	if (isLoading) {
		return null;
	}

	return (
		<ul className={styles["nav-list"]}>
			{user ? (
				<>
					<li>
						<Link to={AppRoute.ROOT}>Home</Link>
					</li>
					<li>
						<Link to={AppRoute.TRAINING}>Training</Link>
					</li>
					<li className={styles["identity-label"]}>{user.email}</li>
					<li>
						<Button
							label="Sign out"
							onClick={handleSignOut}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</li>
				</>
			) : (
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
	);
};

export { HeaderNavigation };
