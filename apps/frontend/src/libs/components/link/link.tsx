import { useCallback } from "react";
import { NavLink } from "react-router-dom";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	className?: string | undefined;
	to: NavigableRoute;
};

const Link: React.FC<Properties> = ({
	children,
	className,
	to,
}: Properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClasses(styles["link"], isActive && styles["active"], className),
		[className],
	);

	return (
		<NavLink className={getLinkClassName} to={to}>
			{children}
		</NavLink>
	);
};

export { Link };
