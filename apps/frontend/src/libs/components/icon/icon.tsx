import { type IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	className: string | undefined;
	iconName: ValueOf<typeof IconName>;
};

const Icon: React.FC<Properties> = ({ className, iconName }: Properties) => (
	<span
		aria-hidden="true"
		className={getValidClasses(styles["icon"], styles[iconName], className)}
	/>
);

export { Icon };
