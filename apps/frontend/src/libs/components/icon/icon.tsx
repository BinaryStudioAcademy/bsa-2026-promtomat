import { type IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { iconNameToIcon } from "./libs/maps.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	iconName: ValueOf<typeof IconName>;
};

const Icon: React.FC<Properties> = ({ className, iconName }: Properties) => {
	const IconComponent = iconNameToIcon[iconName];

	return (
		<IconComponent
			aria-hidden="true"
			className={getValidClasses(styles["icon"], className)}
			focusable="false"
		/>
	);
};

export { Icon };
