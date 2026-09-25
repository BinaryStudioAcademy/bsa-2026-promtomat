import React, { useCallback, useId, useState } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { Button } from "../button/button.js";
import { SCORE_RANGE } from "./libs/constants/constants.js";
import { ScoreDescription } from "./libs/enums/enums.js";
import { getScoreColor } from "./libs/helpers/get-score-color.helper.js";
import styles from "./styles.module.css";

type Properties = {
	isDescriptionHidden?: boolean;
	isDisabled?: boolean;
	isRadio?: boolean;
	label: string;
	onScoreSelect: (score: number) => () => void;
	selectedScore?: null | number;
};

const ScoreGrid: React.FC<Properties> = ({
	isDescriptionHidden = false,
	isDisabled = false,
	isRadio = false,
	label,
	onScoreSelect,
	selectedScore,
}) => {
	const [hoveredScore, setHoveredScore] = useState<null | number>(null);
	const [internalScore, setInternalScore] = useState<null | number>(null);

	const inputId = useId();

	const currentSelectedScore =
		selectedScore === undefined ? internalScore : selectedScore;
	const handleHover = useCallback((score: number) => {
		return (): void => {
			setHoveredScore(score);
		};
	}, []);

	const handleClearHover = useCallback((): void => {
		setHoveredScore(null);
	}, []);

	const handleScoreClick = useCallback(
		(score: number) => {
			return (): void => {
				if (isRadio && selectedScore === undefined) {
					setInternalScore((previous) => (previous === score ? null : score));
				}
				onScoreSelect(score)();
			};
		},
		[isRadio, onScoreSelect, selectedScore],
	);

	const displayedScore = isRadio
		? (hoveredScore ?? currentSelectedScore)
		: hoveredScore;

	const activeDescription = displayedScore
		? ScoreDescription[displayedScore]
		: "Hover or focus a score to see its evaluation criteria";

	const messageColorClass = displayedScore
		? styles[getScoreColor(displayedScore)]
		: "";

	return (
		<div className={styles["field"]}>
			<label className={styles["label"]} htmlFor={inputId}>
				{label}
			</label>
			<div className={styles["control"]}>
				{SCORE_RANGE.map((score) => {
					const isHovered = hoveredScore === score;
					const isSelected = isRadio && currentSelectedScore === score;
					const isActive = isHovered || isSelected;

					const buttonColorClass = isActive
						? getScoreColor(score)
						: "secondary";

					return (
						<Button
							className={getValidClasses(
								styles["score-button"],
								isSelected && styles["score-button--selected"],
							)}
							isDisabled={isDisabled}
							key={score}
							label={String(score)}
							onBlur={handleClearHover}
							onClick={handleScoreClick(score)}
							onFocus={handleHover(score)}
							onMouseEnter={handleHover(score)}
							onMouseLeave={handleClearHover}
							size="lg"
							type="button"
							variant={buttonColorClass}
						/>
					);
				})}
			</div>
			{!isDescriptionHidden && (
				<div
					aria-live="polite"
					className={getValidClasses(styles["message"], messageColorClass)}
				>
					{activeDescription}
				</div>
			)}
		</div>
	);
};

export { ScoreGrid };
