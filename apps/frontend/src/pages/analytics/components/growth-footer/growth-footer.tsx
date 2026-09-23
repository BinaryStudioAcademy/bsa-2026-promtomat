import React from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

import { SCORE_FRACTION_DIGITS } from "../../libs/constants/constants.js";
import { AnalyticLabel, GrowthUnits } from "../../libs/enums/enums.js";
import { formatScoreChange } from "../../libs/helpers/format-score-change.helper.js";
import { formatScore } from "../../libs/helpers/format-score.helper.js";
import { type GrowthSummary, type ScoreDelta } from "../../libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	count: number;
	granularity: AnalyticsGranularity;
	summary: GrowthSummary;
};

const GrowthFooter: React.FC<Properties> = ({
	count,
	granularity,
	summary,
}: Properties) => {
	const { first, latest } = summary;
	const delta: ScoreDelta =
		first !== null && latest !== null && summary.hasTrend
			? {
					change: Number((latest - first).toFixed(SCORE_FRACTION_DIGITS)),
					previousScore: first,
				}
			: { change: null, previousScore: null };

	const change = formatScoreChange(delta);
	const { plural } = GrowthUnits[granularity];

	return (
		<footer className={styles["footer"]}>
			<dl className={styles["stats"]}>
				<div className={styles["stat"]}>
					<dt className={styles["label"]}>{AnalyticLabel.GROWTH_FIRST}</dt>
					<dd className={styles["value"]}>{formatScore(first)}</dd>
				</div>
				<div className={styles["stat"]}>
					<dt className={styles["label"]}>{AnalyticLabel.GROWTH_LATEST}</dt>
					<dd className={styles["value"]}>{formatScore(latest)}</dd>
				</div>
				<div className={styles["stat"]}>
					<dt className={styles["label"]}>{AnalyticLabel.GROWTH_CHANGE}</dt>
					<dd className={getValidClasses(styles["value"], styles[change.tone])}>
						{change.value}
					</dd>
				</div>
			</dl>
			<p className={styles["range"]}>
				{AnalyticLabel.GROWTH_RANGE_PREFIX} {count} {plural}
			</p>
		</footer>
	);
};

export { GrowthFooter };
