import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import { LoggingStreakMessage } from "./libs/enums/enums.js";
import { getStreakDayIntensity } from "./libs/helpers/helpers.js";
import { type StreakDay } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	streakData: StreakDay[];
};

const LoggingStreak: React.FC<Properties> = ({ streakData }: Properties) => {
	const dayLenght = streakData.length;
	const maxLogCount = Math.max(
		EMPTY_LENGTH,
		...streakData.map((day) => day.logCount),
	);

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{LoggingStreakMessage.TITLE}</h2>
			{streakData.length === EMPTY_LENGTH ? (
				<p className={styles["message"]}>{LoggingStreakMessage.EMPTY}</p>
			) : (
				<>
					<p className={styles["summary"]}>
						<span className={styles["count"]}>{dayLenght}</span>
						<span className={styles["unit"]}>{LoggingStreakMessage.UNIT}</span>
					</p>
					<ul className={styles["days"]}>
						{streakData.map((day) => {
							const fillStyle = {
								opacity: getStreakDayIntensity(day.logCount, maxLogCount),
							};

							return (
								<li className={styles["day"]} key={day.date}>
									<span
										aria-hidden="true"
										className={styles["fill"]}
										style={fillStyle}
									/>
									<span className="visually-hidden">
										{day.date}: {day.logCount} {LoggingStreakMessage.LOG_UNIT}
									</span>
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
