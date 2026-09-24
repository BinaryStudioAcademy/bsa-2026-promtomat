import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type MetricTone } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	caption: string;
	label: string;
	tone: ValueOf<typeof MetricTone>;
	value: string;
};

const MetricCard: React.FC<Properties> = ({
	caption,
	label,
	tone,
	value,
}: Properties) => {
	return (
		<div className={styles["card"]}>
			<dt className={styles["label"]}>{label}</dt>
			<dd className={styles["content"]}>
				<span className={getValidClasses(styles["value"], styles[tone])}>
					{value}
				</span>
				{caption && <span className={styles["caption"]}>{caption}</span>}
			</dd>
		</div>
	);
};

export { MetricCard };
