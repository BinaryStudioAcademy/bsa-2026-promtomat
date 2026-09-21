import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { LoggingStreakMessage } from "./libs/enums/enums.js";
import { type StreakCell } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	cells: StreakCell[];
	currentStreak: number;
};

const LoggingStreak: React.FC<Properties> = ({
	cells,
	currentStreak,
}: Properties) => {
	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{LoggingStreakMessage.TITLE}</h2>
			{cells.length === EMPTY_LENGTH ? (
				<p className={styles["message"]}>{LoggingStreakMessage.EMPTY}</p>
			) : (
				<>
					<p className={styles["summary"]}>
						<span className={styles["count"]}>{currentStreak}</span>
						<span className={styles["unit"]}>{LoggingStreakMessage.UNIT}</span>
					</p>
					<ul className={styles["days"]}>
						{cells.map((cell) => {
							const fillStyle = { opacity: cell.intensity };

							return (
								<li className={styles["day"]} key={cell.id}>
									<span
										aria-hidden="true"
										className={styles["fill"]}
										style={fillStyle}
									/>
									<span
										aria-hidden="true"
										className={getValidClasses(
											styles["tooltip"],
											styles[`tooltip-${cell.alignment}`],
										)}
									>
										{cell.label}
									</span>
									<span className="visually-hidden">{cell.label}</span>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</section>
	);
};

export { LoggingStreak };
