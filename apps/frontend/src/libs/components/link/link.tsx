import clsx from "clsx";
import { useCallback } from "react";
import { NavLink } from "react-router-dom";

import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	className?: string;
	to: ValueOf<typeof AppRoute>;
};

const Link: React.FC<Properties> = ({
	children,
	className,
	to,
}: Properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			clsx(styles["link"], isActive && styles["active"], className),
		[className],
	);

	return (
		<NavLink className={getLinkClassName} to={to}>
			{children}
		</NavLink>
	);
};

export { Link };
