import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";
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
	if (isLoading) {
		return null;
	}

	return (
		<ul className={styles["navList"]}>
			{user ? (
				<>
					<li>
						<Link to={AppRoute.ROOT}>Root</Link>
					</li>
					<li className={styles["identityLabel"]}>{user.email}</li>
					<li>
						<Button
							label="Sign out"
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
