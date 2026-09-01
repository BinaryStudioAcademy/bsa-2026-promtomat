import { ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	size?: ValueOf<typeof ControlSize>;
};

const Logo: React.FC<Properties> = ({ size = ControlSize.MD }: Properties) => (
	<div className={getValidClasses(styles["logo"], styles[size])}>
		{/* TODO pm-92 replace the temporary CSS mark with the final SVG logo */}
		<span aria-hidden="true" className={styles["mark"]}>
			P
		</span>
		<span className={styles["wordmark"]}>Promptomat</span>
	</div>
);

export { Logo };
