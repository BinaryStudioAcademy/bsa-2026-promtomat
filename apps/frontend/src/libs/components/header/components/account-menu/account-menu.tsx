import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import {
	AppRoute,
	EventType,
	IconName,
	KeyboardKey,
} from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useSignOut } from "~/modules/auth/auth.js";
import { type UserDto } from "~/modules/users/users.js";

import {
	ACCOUNT_MENU_ID,
	PANEL_CLOSE_DURATION_MS,
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
	const panelReference = useRef<HTMLDivElement>(null);
	const triggerReference = useRef<HTMLButtonElement>(null);
	const initials = getNicknameInitials(user.nickname);
	const isPanelRendered = isClosing || isOpen;

	const beginClose = useCallback((): void => {
		setIsClosing(true);
		setIsOpen(false);
	}, []);

	const finishClose = useCallback((): void => {
		setIsClosing(false);
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

		const panelElement = panelReference.current;

		if (!panelElement || panelElement.getAnimations().length === EMPTY_LENGTH) {
			finishClose();
			return;
		}

		const timeoutId = setTimeout(finishClose, PANEL_CLOSE_DURATION_MS);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [finishClose, isClosing]);

	const handlePanelAnimationEnd = useCallback(
		(event: React.AnimationEvent<HTMLDivElement>): void => {
			if (!isClosing || event.target !== event.currentTarget) {
				return;
			}

			finishClose();
		},
		[finishClose, isClosing],
	);

	const handleCloseAndFocusTrigger = useCallback((): void => {
		handleClose();
		triggerReference.current?.focus();
	}, [handleClose]);

	const handleSignOut = useCallback((): void => {
		handleClose();
		void signOut();
	}, [handleClose, signOut]);

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

		document.addEventListener(EventType.KEYDOWN, handleKeyDown, {
			capture: true,
		});

		return () => {
			document.removeEventListener(EventType.KEYDOWN, handleKeyDown, true);
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

		document.addEventListener(EventType.POINTER_DOWN, handlePointerDown);

		return () => {
			document.removeEventListener(EventType.POINTER_DOWN, handlePointerDown);
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
					onAnimationEnd={handlePanelAnimationEnd}
					ref={panelReference}
				>
					<div className={styles["identity"]}>
						<span className={styles["avatar"]}>{initials}</span>
						<span className={styles["identity-copy"]}>
							<span className={styles["identity-name"]}>{user.nickname}</span>
							<span className={styles["identity-email"]}>{user.email}</span>
						</span>
					</div>
					<div className={styles["list"]}>
						<Link
							activeClassName={styles["active"]}
							className={styles["item"]}
							hasDefaultStyles={false}
							to={AppRoute.PROFILE}
						>
							<Icon iconName={IconName.USER} />
							{HeaderLabel.PROFILE}
						</Link>
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
