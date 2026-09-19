import { useCallback } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { type IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	iconName: ValueOf<typeof IconName>;
	label: string;
	to: NavigableRoute;
};

const SidebarNavigationItem: React.FC<Properties> = ({
	iconName,
	label,
	to,
}: Properties) => {
	const getClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClasses(styles["item"], isActive && styles["active"]),
		[],
	);

	return (
		<Link className={getClassName} hasDefaultStyles={false} to={to}>
			<Icon iconName={iconName} />
			{label}
		</Link>
	);
};

export { SidebarNavigationItem };
