import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import brandLogo from "~/assets/img/brand.svg";
import { Button } from "~/libs/components/button/button.js";
import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { Link } from "~/libs/components/link/link.js";
import { AppRoute, ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

import { KeyboardKey } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const Header: React.FC = () => {
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [previousPathname, setPreviousPathname] = useState(pathname);
	const toggleButtonReference = useRef<HTMLButtonElement>(null);
	const { data: user } = useGetAuthenticatedUserQuery(undefined);

	if (pathname !== previousPathname) {
		setPreviousPathname(pathname);
		setIsMenuOpen(false);
	}

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
			if (event.key !== KeyboardKey.ESCAPE) {
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

			<div className={styles["menuToggle"]}>
				<IconButton
					ariaControls="primary-navigation"
					ariaExpanded={isMenuOpen}
					ariaLabel="Toggle navigation"
					iconName={IconName.MENU}
					onClick={handleMenuToggle}
					reference={toggleButtonReference}
					type="button"
				/>
			</div>

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
								<Link to={AppRoute.ROOT}>Root</Link>
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
