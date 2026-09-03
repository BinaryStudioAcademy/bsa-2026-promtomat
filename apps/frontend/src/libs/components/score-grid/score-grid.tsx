import React, { useCallback, useId, useState } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { Button } from "../button/button.js";
import { SCORE_RANGE } from "./libs/constants/constants.js";
import { ScoreDescriptions } from "./libs/enums/enums.js";
import { getScoreColor } from "./libs/helpers/get-score-color.helper.js";
import styles from "./styles.module.css";

type Properties = {
	disabled?: boolean;
	label: string;
	onScoreSelect: (score: number) => () => void;
};

const ScoreGrid: React.FC<Properties> = ({
	disabled = false,
	label,
	onScoreSelect,
}) => {
	const [activeScore, setActiveScore] = useState<null | number>(null);

	const inputId = useId();

	const handleActive = useCallback((score: number) => {
		return (): void => {
			setActiveScore(score);
		};
	}, []);

	const clearActive = useCallback((): void => {
		setActiveScore(null);
	}, []);

	const activeDescription = activeScore
		? ScoreDescriptions[activeScore]
		: "Hover or focus a score to see its evaluation criteria";

	const messageColorClass = activeScore
		? styles[getScoreColor(activeScore)]
		: "";

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={inputId}>
				{label}
			</label>
			<div className={styles["control"]}>
				{SCORE_RANGE.map((score) => {
					const isActive = activeScore === score;
					const buttonColorClass = isActive
						? getScoreColor(score)
						: "secondary";
					return (
						<Button
							className={styles["score-button"]}
							isDisabled={disabled}
							key={score}
							label={String(score)}
							onBlur={clearActive}
							onClick={onScoreSelect(score)}
							onFocus={handleActive(score)}
							onMouseEnter={handleActive(score)}
							onMouseLeave={clearActive}
							size="lg"
							type="button"
							variant={buttonColorClass}
						/>
					);
				})}
			</div>
			<div
				aria-live="polite"
				className={getValidClasses(styles["message"], messageColorClass)}
			>
				{activeDescription}
			</div>
		</div>
	);
};

export { ScoreGrid };
