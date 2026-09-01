import React, { useCallback, useState } from "react";

import { ButtonVariant } from "~/libs/enums/button-variant.enum.js";
import { ValueOf } from "~/libs/types/types.js";

import { Button } from "../button/button.js";
import { SCORE_DESCRIPTIONS, SCORE_THRESHOLD } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const SCORE_RANGE = Object.keys(SCORE_DESCRIPTIONS).map(Number);

const getScoreColor = (score: number): ValueOf<typeof ButtonVariant> => {
	if (score <= SCORE_THRESHOLD.DANGER_MAX) {
		return ButtonVariant.DANGER_OUTLINE;
	}
	if (score <= SCORE_THRESHOLD.WARNING_MAX) {
		return ButtonVariant.WARNING_OUTLINE;
	}
	return ButtonVariant.SUCCESS_OUTLINE;
};

type Properties = {
	disabled?: boolean;
	onScoreSelect: (score: number) => () => void;
};

const ScoreGrid: React.FC<Properties> = ({
	disabled = false,
	onScoreSelect,
}) => {
	const [activeScore, setActiveScore] = useState<null | number>(null);

	const handleActive = useCallback((score: number) => {
		return (): void => {
			setActiveScore(score);
		};
	}, []);

	const clearActive = useCallback((): void => {
		setActiveScore(null);
	}, []);

	const activeDescription = activeScore
		? SCORE_DESCRIPTIONS[activeScore]
		: null;

	const messageColorClass = activeScore
		? styles[getScoreColor(activeScore)]
		: "";

	return (
		<div className={styles["score-grid-wrapper"]}>
			<div className={styles["btn-wrapper"]}>
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
							variant={buttonColorClass}
						/>
					);
				})}
			</div>
			<div
				aria-live="polite"
				className={`${styles["message"] ?? ""} ${messageColorClass ?? ""}`}
			>
				{activeDescription ??
					"Hover or focus a score to see its evaluation criteria"}
			</div>
		</div>
	);
};

export { ScoreGrid };
