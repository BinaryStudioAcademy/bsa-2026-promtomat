import { Link } from "react-router-dom";

import styles from "~/libs/components/button/styles.module.css";
import { Icon } from "~/libs/components/icon/icon.js";
import {
	ButtonVariant,
	ControlSize,
	type IconName,
} from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type NavigableRoute, type ValueOf } from "~/libs/types/types.js";

type Properties = {
	className?: string | undefined;
	iconName?: ValueOf<typeof IconName>;
	label: string;
	size?: ValueOf<typeof ControlSize>;
	to: NavigableRoute;
	variant?: ValueOf<typeof ButtonVariant>;
};

const ButtonLink: React.FC<Properties> = ({
	className,
	iconName,
	label,
	size = ControlSize.MD,
	to,
	variant = ButtonVariant.PRIMARY,
}: Properties) => (
	<Link
		className={getValidClasses(
			styles["button"],
			styles[variant],
			styles[size],
			className,
		)}
		to={to}
	>
		{iconName && <Icon iconName={iconName} />}
		{label}
	</Link>
);

export { ButtonLink };
