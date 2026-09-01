import { useCallback, useEffect, useRef, useState } from "react";

import brandLogo from "~/assets/img/brand.svg";
import { Button } from "~/libs/components/button/button.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleButtonReference = useRef<HTMLButtonElement>(null);
	const { data: user } = useGetAuthenticatedUserQuery(undefined);

	const handleMenuToggle = useCallback((): void => {
		setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
	}, []);

	const handleMenuClose = useCallback((): void => {
		setIsMenuOpen(false);
	}, []);

	useEffect(() => {
		if (!isMenuOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key !== "Escape") {
				return;
			}

			setIsMenuOpen(false);
			toggleButtonReference.current?.focus();
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMenuOpen]);

	return (
		<header className={styles["header"]}>
			<Link className={styles["identity"]} to={AppRoute.ROOT}>
				<img alt="Promptomat" className={styles["logo"]} src={brandLogo} />
			</Link>

			<button
				aria-controls="primary-navigation"
				aria-expanded={isMenuOpen}
				aria-label="Toggle navigation"
				className={styles["menuToggle"]}
				onClick={handleMenuToggle}
				ref={toggleButtonReference}
				type="button"
			>
				<span className={styles["menuIcon"]} />
			</button>

			<nav
				aria-label="Main"
				className={getValidClasses(
					styles["nav"],
					isMenuOpen && styles["navOpen"],
				)}
				id="primary-navigation"
			>
				<ul className={styles["navList"]}>
					{user ? (
						<>
							<li>
								<Link onClick={handleMenuClose} to={AppRoute.ROOT}>
									Root
								</Link>
							</li>
							<li className={styles["identityLabel"]}>{user.email}</li>
							<li>
								<Button
									label="Sign out"
									onClick={handleMenuClose}
									type="button"
									variant={ButtonVariant.SECONDARY}
								/>
							</li>
						</>
					) : (
						<>
							<li>
								<Link onClick={handleMenuClose} to={AppRoute.SIGN_IN}>
									Sign in
								</Link>
							</li>
							<li>
								<Link onClick={handleMenuClose} to={AppRoute.SIGN_UP}>
									Sign up
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export { Header };
