import React from "react";

import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import { AnalyticLabel } from "../../libs/enums/enums.js";
import { formatScore } from "../../libs/helpers/format-score.helper.js";
import { getScoreTone } from "../../libs/helpers/get-score-tone.helper.js";
import styles from "./styles.module.css";

type Properties = {
	averageScore: number;
	count: number;
	label: string;
};

const KeywordWeightRow: React.FC<Properties> = ({
	averageScore,
	count,
	label,
}: Properties) => {
	const keyword = `${AnalyticLabel.KEYWORD_PREFIX}${label}`;
	const tone = getScoreTone(averageScore);

	return (
		<li className={getValidClasses(styles["row"], styles[tone])}>
			<div className={styles["header"]}>
				<span className={styles["label"]}>{keyword}</span>
				<div className={styles["stats"]}>
					<ScoreBadge
						efficiencyScore={averageScore}
						isFill={false}
						label={formatScore(averageScore)}
					/>
					<span className={styles["count"]}>{count}</span>
				</div>
			</div>
			<ProgressBar
				className={styles["bar"]}
				count={averageScore}
				isSummaryHidden
				label={keyword}
				target={PromptValidationRule.EFFICIENCY_SCORE_MAX}
				unit="points"
			/>
		</li>
	);
};

export { KeywordWeightRow };
