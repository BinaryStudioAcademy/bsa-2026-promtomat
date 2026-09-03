import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { Link } from "~/libs/components/link/link.js";
import { Logo } from "~/libs/components/logo/logo.js";
import { AppRoute, ControlSize, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type UserDto } from "~/modules/users/users.js";

import { HeaderNavigation } from "./components/header-navigation/header-navigation.js";
import { KeyboardKey } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	isLoading: boolean;
	user: null | UserDto;
};

const Header: React.FC<Properties> = ({ isLoading, user }: Properties) => {
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [previousPathname, setPreviousPathname] = useState(pathname);
	const toggleButtonReference = useRef<HTMLButtonElement>(null);
	const navReference = useRef<HTMLElement>(null);

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

	useEffect(() => {
		const navElement = navReference.current;

		if (!navElement) {
			return;
		}

		navElement.addEventListener("click", handleMenuClose);

		return () => {
			navElement.removeEventListener("click", handleMenuClose);
		};
	}, [handleMenuClose]);

	return (
		<header className={styles["header"]}>
			<Link className={styles["identity"]} to={AppRoute.ROOT}>
				<Logo size={ControlSize.SM} />
			</Link>

			<div className={styles["menuToggle"]}>
				<IconButton
					ariaControls="primary-navigation"
					ariaExpanded={isMenuOpen}
					ariaLabel="Toggle navigation"
					iconName={IconName.MENU}
					onClick={handleMenuToggle}
					reference={toggleButtonReference}
				/>
			</div>

			<nav
				aria-label="Main"
				className={getValidClasses(
					styles["nav"],
					isMenuOpen && styles["navOpen"],
				)}
				id="primary-navigation"
				ref={navReference}
			>
				<HeaderNavigation isLoading={isLoading} user={user} />
			</nav>
		</header>
	);
};

export { Header };
