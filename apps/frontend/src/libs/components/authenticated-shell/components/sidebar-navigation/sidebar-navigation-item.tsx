import { Link, useLocation } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { type IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";

import { checkIsShellRouteActive } from "../../libs/helpers/helpers.js";
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
	const { pathname } = useLocation();
	const isActive = checkIsShellRouteActive({ pathname, to });

	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			className={getValidClasses(styles["item"], isActive && styles["active"])}
			to={to}
		>
			<Icon iconName={iconName} />
			{label}
		</Link>
	);
};

export { SidebarNavigationItem };
