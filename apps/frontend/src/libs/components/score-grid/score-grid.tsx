import React, { useCallback, useId, useState } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { Button } from "../button/button.js";
import {
	INSET_SOLID_CLASS_NAME,
	SCORE_RANGE,
} from "./libs/constants/constants.js";
import { ScoreDescription } from "./libs/enums/enums.js";
import { getScoreColor } from "./libs/helpers/get-score-color.helper.js";
import styles from "./styles.module.css";

type Properties = {
	isDescriptionHidden?: boolean;
	isDisabled?: boolean;
	isRadio?: boolean;
	label: string;
	onScoreHover?: (score: null | number) => void;
	onScoreSelect: (score: number) => () => void;
	selectedScore?: null | number;
	variant?: "default" | "inset";
};

const ScoreGrid: React.FC<Properties> = ({
	isDescriptionHidden = false,
	isDisabled = false,
	isRadio = false,
	label,
	onScoreHover,
	onScoreSelect,
	selectedScore,
	variant = "default",
}) => {
	const [hoveredScore, setHoveredScore] = useState<null | number>(null);
	const [internalScore, setInternalScore] = useState<null | number>(null);

	const inputId = useId();
	const isInset = variant === "inset";

	const currentSelectedScore =
		selectedScore === undefined ? internalScore : selectedScore;
	const handleHover = useCallback(
		(score: number) => {
			return (): void => {
				setHoveredScore(score);
				onScoreHover?.(score);
			};
		},
		[onScoreHover],
	);

	const handleClearHover = useCallback((): void => {
		setHoveredScore(null);
		onScoreHover?.(null);
	}, [onScoreHover]);

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
		<div
			className={getValidClasses(styles["field"], isInset && styles["inset"])}
		>
			<label
				className={getValidClasses(
					styles["label"],
					isInset && styles["label-eyebrow"],
				)}
				htmlFor={inputId}
			>
				{label}
			</label>
			<div
				className={getValidClasses(
					styles["control"],
					isInset && styles["control-inset"],
				)}
			>
				{SCORE_RANGE.map((score) => {
					const isHovered = hoveredScore === score;
					const isSelected = isRadio && currentSelectedScore === score;
					const isActive = isHovered || isSelected;
					const scoreColorVariant = getScoreColor(score);
					const buttonColorClass =
						isActive && !isInset ? scoreColorVariant : "secondary";

					return (
						<Button
							className={getValidClasses(
								styles["score-button"],
								isSelected && styles["score-button--selected"],
								isInset &&
									isActive &&
									styles[INSET_SOLID_CLASS_NAME[scoreColorVariant] ?? ""],
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
