import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { AppRoute, IconName, KeyboardKey } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSignOut } from "~/modules/auth/auth.js";
import { type UserDto } from "~/modules/users/users.js";

import {
	ACCOUNT_MENU_ID,
	PANEL_CLOSE_DURATION_MS,
	REDUCED_MOTION_DURATION_MS,
} from "../../libs/constants/constants.js";
import { HeaderLabel } from "../../libs/enums/enums.js";
import { getNicknameInitials } from "../../libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	isNavigationOpen: boolean;
	user: UserDto;
};

const AccountMenu: React.FC<Properties> = ({
	isNavigationOpen,
	user,
}: Properties) => {
	const { pathname } = useLocation();
	const signOut = useSignOut();
	const [isClosing, setIsClosing] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [previousPathname, setPreviousPathname] = useState(pathname);
	const containerReference = useRef<HTMLDivElement>(null);
	const triggerReference = useRef<HTMLButtonElement>(null);
	const initials = getNicknameInitials(user.nickname);
	const isPanelRendered = isClosing || isOpen;

	const beginClose = useCallback((): void => {
		setIsClosing(true);
		setIsOpen(false);
	}, []);

	if (pathname !== previousPathname) {
		setPreviousPathname(pathname);

		if (isOpen) {
			beginClose();
		}
	}

	if (isNavigationOpen && isOpen) {
		setIsOpen(false);
	}

	const handleToggle = useCallback((): void => {
		if (isOpen) {
			beginClose();
			return;
		}

		setIsClosing(false);
		setIsOpen(true);
	}, [beginClose, isOpen]);

	const handleClose = useCallback((): void => {
		if (!isOpen) {
			return;
		}

		beginClose();
	}, [beginClose, isOpen]);

	useEffect(() => {
		if (!isClosing) {
			return;
		}

		const isReducedMotion = matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const timeoutId = setTimeout(
			() => {
				setIsClosing(false);
			},
			isReducedMotion ? REDUCED_MOTION_DURATION_MS : PANEL_CLOSE_DURATION_MS,
		);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isClosing]);

	const handleCloseAndFocusTrigger = useCallback((): void => {
		handleClose();
		triggerReference.current?.focus();
	}, [handleClose]);

	const handleSignOut = useCallback((): void => {
		handleClose();
		void signOut();
	}, [handleClose, signOut]);

	const getProfileClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClasses(styles["item"], isActive && styles["active"]),
		[],
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key !== KeyboardKey.ESCAPE) {
				return;
			}

			event.stopImmediatePropagation();
			handleCloseAndFocusTrigger();
		};

		document.addEventListener("keydown", handleKeyDown, { capture: true });

		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
		};
	}, [handleCloseAndFocusTrigger, isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent): void => {
			const { target } = event;

			if (!(target instanceof Node)) {
				return;
			}

			if (containerReference.current?.contains(target)) {
				return;
			}

			handleClose();
		};

		document.addEventListener("pointerdown", handlePointerDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [handleClose, isOpen]);

	return (
		<div className={styles["menu"]} ref={containerReference}>
			<button
				aria-controls={ACCOUNT_MENU_ID}
				aria-expanded={isOpen}
				className={styles["trigger"]}
				onClick={handleToggle}
				ref={triggerReference}
				type="button"
			>
				<span className={styles["avatar"]}>{initials}</span>
				<span className={styles["nickname"]}>{user.nickname}</span>
				<span className="visually-hidden">{HeaderLabel.ACCOUNT_MENU}</span>
				<Icon
					className={getValidClasses(
						styles["chevron"],
						isOpen && styles["chevron-open"],
					)}
					iconName={IconName.CHEVRON}
				/>
			</button>
			{isPanelRendered ? (
				<div
					className={getValidClasses(
						styles["panel"],
						isClosing && styles["panel-out"],
					)}
					id={ACCOUNT_MENU_ID}
				>
					<div className={styles["identity"]}>
						<span className={styles["avatar"]}>{initials}</span>
						<span className={styles["identity-copy"]}>
							<span className={styles["identity-name"]}>{user.nickname}</span>
							<span className={styles["identity-email"]}>{user.email}</span>
						</span>
					</div>
					<div className={styles["list"]}>
						<NavLink className={getProfileClassName} to={AppRoute.SETTINGS}>
							<Icon iconName={IconName.USER} />
							{HeaderLabel.PROFILE}
						</NavLink>
						<button
							className={getValidClasses(styles["item"], styles["sign-out"])}
							onClick={handleSignOut}
							type="button"
						>
							<Icon iconName={IconName.LOG_OUT} />
							{HeaderLabel.SIGN_OUT}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export { AccountMenu };
