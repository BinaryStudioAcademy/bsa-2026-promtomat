import React from "react";

import { type PromptRecentDto } from "~/modules/prompts/libs/types/types.js";

import { RecentInjectionsMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	items: PromptRecentDto[];
};

const RecentInjections: React.FC<Properties> = ({ items }: Properties) => {
	const [firstItem] = items;

	return (
		<section className={styles["section"]}>
			<h2 className={styles["heading"]}>{RecentInjectionsMessage.TITLE}</h2>
			{firstItem ? (
				<ul className={styles["list"]}>
					{items.map((item) => {
						return (
							<li className={styles["item"]} key={item.id}>
								<span className={styles["intent"]}>{item.taskIntent}</span>
								<span className={styles["score"]}>{item.efficiencyScore}</span>
							</li>
						);
					})}
				</ul>
			) : (
				<p className={styles["empty"]}>{RecentInjectionsMessage.EMPTY}</p>
			)}
		</section>
	);
};

export { RecentInjections };
