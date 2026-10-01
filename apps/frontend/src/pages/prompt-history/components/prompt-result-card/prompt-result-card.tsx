import React, { useCallback } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { IconName } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";

import { LINE_BREAK } from "../../libs/constants/constants.js";
import { type PromptHistoryItem } from "../../libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	detailId: string;
	isSelected: boolean;
	onSelect: (uniqueKey: string) => void;
	prompt: PromptHistoryItem;
};

const PromptResultCard: React.FC<Properties> = ({
	detailId,
	isSelected,
	onSelect,
	prompt,
}: Properties) => {
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const [snippet = ""] = prompt.body.split(LINE_BREAK);

	const handleSelect = useCallback((): void => {
		onSelect(prompt.uniqueKey);
	}, [onSelect, prompt.uniqueKey]);

	const score =
		prompt.computedScore ??
		(prompt.score !== null && prompt.score > ZERO_VALUE ? prompt.score : null);

	return (
		<button
			aria-controls={detailId}
			aria-expanded={isSelected}
			className={getValidClasses(
				styles["card"],
				isSelected && styles["card-selected"],
			)}
			onClick={handleSelect}
			type="button"
		>
			<span className={styles["header"]}>
				<span className={styles["intent"]}>{prompt.intent}</span>
				<ScoreBadge
					efficiencyScore={score}
					maxScore={PromptValidationRule.EFFICIENCY_SCORE_MAX}
				/>
				<Icon
					className={getValidClasses(
						styles["chevron"],
						isSelected && styles["chevron-open"],
					)}
					iconName={IconName.CHEVRON}
				/>
			</span>
			<span className={styles["snippet"]}>{snippet}</span>
			<span className={styles["meta"]}>
				<span>{prompt.workspaceName}</span>
				<span aria-hidden="true">·</span>
				<span>{relativeTime}</span>
			</span>
		</button>
	);
};

export { PromptResultCard };
