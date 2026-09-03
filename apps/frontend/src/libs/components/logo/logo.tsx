import logo from "~/assets/img/logo.svg";
import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	isIconOnly?: boolean;
	size?: ValueOf<typeof ControlSize>;
};

const Logo: React.FC<Properties> = ({
	isIconOnly = false,
	size = ControlSize.MD,
}: Properties) => (
	<div className={getValidClasses(styles["logo"], styles[size])}>
		<img
			alt={isIconOnly ? "Promptomat logo" : ""}
			className={styles["mark"]}
			src={logo}
		/>
		{!isIconOnly && <span className={styles["wordmark"]}>Promptomat</span>}
	</div>
);

export { Logo };
