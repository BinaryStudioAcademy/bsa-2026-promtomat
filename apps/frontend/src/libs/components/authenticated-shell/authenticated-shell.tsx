import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Outlet, useLocation, useMatches } from "react-router-dom";

import { GeneratePromptLink } from "~/libs/components/generate-prompt-link/generate-prompt-link.js";
import { Header } from "~/libs/components/header/header.js";
import { Link } from "~/libs/components/link/link.js";
import { Logo } from "~/libs/components/logo/logo.js";
import {
	AppRoute,
	ControlSize,
	EventType,
	KeyboardKey,
} from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

import { SidebarNavigation } from "./components/sidebar-navigation/sidebar-navigation.js";
import {
	APPLICATION_SIDEBAR_ID,
	DEFERRED_FOCUS_DELAY_MS,
	DESKTOP_NAVIGATION_MEDIA_QUERY,
	OUT_OF_TAB_ORDER_INDEX,
} from "./libs/constants/constants.js";
import { ShellLabel } from "./libs/enums/enums.js";
import { resolveShellPageCopy } from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

const AuthenticatedShell: React.FC = () => {
	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const matches = useMatches();
	const { pathname } = useLocation();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [previousPathname, setPreviousPathname] = useState(pathname);
	const toggleButtonReference = useRef<HTMLButtonElement>(null);
	const sidebarReference = useRef<HTMLElement>(null);

	if (pathname !== previousPathname) {
		setPreviousPathname(pathname);
		setIsDrawerOpen(false);
	}

	const handleDrawerToggle = useCallback((): void => {
		setIsDrawerOpen((previousIsDrawerOpen) => !previousIsDrawerOpen);
	}, []);

	const handleDrawerDismiss = useCallback((): void => {
		setIsDrawerOpen(false);
	}, []);

	const handleDrawerClose = useCallback((): void => {
		handleDrawerDismiss();
		toggleButtonReference.current?.focus();
	}, [handleDrawerDismiss]);

	useEffect(() => {
		const mediaQuery = matchMedia(DESKTOP_NAVIGATION_MEDIA_QUERY);
		const handleMediaChange = (): void => {
			if (mediaQuery.matches) {
				setIsDrawerOpen(false);
			}
		};

		mediaQuery.addEventListener(EventType.CHANGE, handleMediaChange);

		return () => {
			mediaQuery.removeEventListener(EventType.CHANGE, handleMediaChange);
		};
	}, []);

	useLayoutEffect(() => {
		if (!isDrawerOpen) {
			return;
		}

		const timeoutId = setTimeout(() => {
			const sidebarElement = sidebarReference.current;
			const firstFocusableElement =
				sidebarElement?.querySelector<HTMLElement>("a[href]");

			firstFocusableElement?.focus();
		}, DEFERRED_FOCUS_DELAY_MS);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isDrawerOpen]);

	useEffect(() => {
		if (!isDrawerOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key !== KeyboardKey.ESCAPE) {
				return;
			}

			handleDrawerClose();
		};

		document.addEventListener(EventType.KEYDOWN, handleKeyDown);

		return () => {
			document.removeEventListener(EventType.KEYDOWN, handleKeyDown);
		};
	}, [handleDrawerClose, isDrawerOpen]);

	useEffect(() => {
		if (!isDrawerOpen) {
			return;
		}

		const sidebarElement = sidebarReference.current;

		if (!sidebarElement) {
			return;
		}

		sidebarElement.addEventListener(EventType.CLICK, handleDrawerClose);

		return () => {
			sidebarElement.removeEventListener(EventType.CLICK, handleDrawerClose);
		};
	}, [handleDrawerClose, isDrawerOpen]);

	if (!user) {
		throw new Error(
			"AuthenticatedShell rendered without an authenticated user.",
		);
	}

	const pageCopy = resolveShellPageCopy(matches);

	return (
		<div className={styles["shell"]}>
			{isDrawerOpen ? (
				<button
					aria-label={ShellLabel.CLOSE_NAVIGATION}
					className={styles["scrim"]}
					onClick={handleDrawerClose}
					tabIndex={OUT_OF_TAB_ORDER_INDEX}
					type="button"
				/>
			) : null}
			<aside
				aria-label={isDrawerOpen ? ShellLabel.NAVIGATION : undefined}
				aria-modal={isDrawerOpen ? true : undefined}
				className={getValidClasses(
					styles["sidebar"],
					isDrawerOpen && styles["sidebar-open"],
				)}
				id={APPLICATION_SIDEBAR_ID}
				ref={sidebarReference}
				role={isDrawerOpen ? "dialog" : undefined}
				tabIndex={isDrawerOpen ? OUT_OF_TAB_ORDER_INDEX : undefined}
			>
				<Link className={styles["identity"]} to={AppRoute.WORKSPACES}>
					<Logo size={ControlSize.SM} />
				</Link>
				<GeneratePromptLink className={styles["generate"]} />
				<span className={styles["section-label"]}>
					{ShellLabel.LIBRARY_SECTION}
				</span>
				<SidebarNavigation />
			</aside>
			<div className={styles["body"]} inert={isDrawerOpen}>
				<Header
					isNavigationOpen={isDrawerOpen}
					navigationId={APPLICATION_SIDEBAR_ID}
					navigationToggleReference={toggleButtonReference}
					onNavigationToggle={handleDrawerToggle}
					subtitle={pageCopy.subtitle}
					title={pageCopy.title}
					user={user}
				/>
				<main className={styles["content"]}>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export { AuthenticatedShell };
