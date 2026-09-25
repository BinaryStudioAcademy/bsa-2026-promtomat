import React from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { IconName } from "~/libs/enums/enums.js";

import { PromptLabelsMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	label: string | undefined;
};

const PromptLabels: React.FC<Properties> = ({ label }: Properties) => {
	return (
		<section aria-live="polite" className={styles["panel"]}>
			<div className={styles["header"]}>
				<Icon className={styles["icon"]} iconName={IconName.BOLT} />
				<h2 className={styles["title"]}>{PromptLabelsMessage.TITLE}</h2>
				<span className={styles["hint"]}>{PromptLabelsMessage.HINT}</span>
			</div>
			{label === undefined ? (
				<p className={styles["message"]}>{PromptLabelsMessage.EMPTY}</p>
			) : (
				<>
					<ul className={styles["list"]}>
						<li className={styles["label"]}>{label}</li>
					</ul>
					<p className={styles["message"]}>{PromptLabelsMessage.SOURCE}</p>
				</>
			)}
		</section>
	);
};

export { PromptLabels };
