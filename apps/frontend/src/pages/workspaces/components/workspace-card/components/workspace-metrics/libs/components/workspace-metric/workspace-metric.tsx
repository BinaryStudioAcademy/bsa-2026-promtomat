import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	label: string;
	tone?: "active" | undefined;
	value: number | string;
};

const WorkspaceMetric: React.FC<Properties> = ({
	label,
	tone,
	value,
}: Properties) => {
	const valueClassName = getValidClasses(
		styles["value"],
		tone === "active" && styles["active"],
	);

	return (
		<div className={styles["metric"]}>
			<span className={styles["label"]}>{label}</span>
			<span className={valueClassName}>{value}</span>
		</div>
	);
};

export { WorkspaceMetric };
