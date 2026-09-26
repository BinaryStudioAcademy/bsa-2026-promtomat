import React, { useCallback } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { PromptDetailLabel } from "~/libs/components/prompt-detail-panel/libs/enums/enums.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { IconName } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { PromptValidationRule } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	detailId: string;
	isSelected: boolean;
	onSelect: (promptId: number) => void;
	prompt: PromptItemResponseDto;
};

const LINE_BREAK = "\n";

const PromptResultCard: React.FC<Properties> = ({
	detailId,
	isSelected,
	onSelect,
	prompt,
}: Properties) => {
	const relativeTime = getRelativeTimeLabel(prompt.createdAt);
	const [snippet = ""] = prompt.body.split(LINE_BREAK);

	const handleSelect = useCallback((): void => {
		onSelect(prompt.id);
	}, [onSelect, prompt.id]);

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
				<Icon
					className={getValidClasses(
						styles["chevron"],
						isSelected && styles["chevron-open"],
					)}
					iconName={IconName.CHEVRON}
				/>
				{prompt.score === null ? (
					<span className={styles["unrated"]}>
						{PromptDetailLabel.UNRATED}
					</span>
				) : (
					<ScoreBadge
						efficiencyScore={prompt.score}
						label={`${String(prompt.score)}/${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`}
					/>
				)}
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
