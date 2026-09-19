import { useCallback } from "react";
import { NavLink } from "react-router-dom";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type LinkClassName = ((state: { isActive: boolean }) => string) | string;

type Properties = {
	children: React.ReactNode;
	className?: LinkClassName | undefined;
	hasDefaultStyles?: boolean;
	to: NavigableRoute;
};

const Link: React.FC<Properties> = ({
	children,
	className,
	hasDefaultStyles = true,
	to,
}: Properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string => {
			const resolvedClassName =
				typeof className === "function" ? className({ isActive }) : className;

			if (!hasDefaultStyles) {
				return getValidClasses(resolvedClassName);
			}

			return getValidClasses(
				styles["link"],
				isActive && styles["active"],
				resolvedClassName,
			);
		},
		[className, hasDefaultStyles],
	);

	return (
		<NavLink className={getLinkClassName} to={to}>
			{children}
		</NavLink>
	);
};

export { Link };
