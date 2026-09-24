import { useCallback } from "react";
import { NavLink } from "react-router-dom";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	activeClassName?: string | undefined;
	children: React.ReactNode;
	className?: string | undefined;
	hasDefaultStyles?: boolean;
	to: NavigableRoute;
};

const Link: React.FC<Properties> = ({
	activeClassName,
	children,
	className,
	hasDefaultStyles = true,
	to,
}: Properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClasses(
				hasDefaultStyles && styles["link"],
				hasDefaultStyles && isActive && styles["active"],
				className,
				isActive && activeClassName,
			),
		[activeClassName, className, hasDefaultStyles],
	);

	return (
		<NavLink className={getLinkClassName} to={to}>
			{children}
		</NavLink>
	);
};

export { Link };
