import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	caption?: string | undefined;
	children: React.ReactNode;
	className?: string | undefined;
	label: string;
};

const StatCard: React.FC<Properties> = ({
	caption,
	children,
	className,
	label,
}: Properties) => {
	return (
		<div className={getValidClasses(styles["card"], className)}>
			<dt className={styles["label"]}>{label}</dt>
			<dd className={styles["figure"]}>
				<span className={styles["value"]}>{children}</span>
				{caption && <span className={styles["caption"]}>{caption}</span>}
			</dd>
		</div>
	);
};

export { StatCard };
