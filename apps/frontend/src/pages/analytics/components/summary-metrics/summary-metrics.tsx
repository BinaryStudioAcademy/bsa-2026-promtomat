import React from "react";

import { type AnalyticsDashboardResponseDto } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel, MetricTone } from "../../libs/enums/enums.js";
import { formatScoreChange } from "../../libs/helpers/format-score-change.helper.js";
import { formatScore } from "../../libs/helpers/format-score.helper.js";
import { getScoredCount } from "../../libs/helpers/get-scored-count.helper.js";
import { MetricCard } from "../metric-card/metric-card.js";
import styles from "./styles.module.css";

type Properties = {
	dashboard: AnalyticsDashboardResponseDto;
};

const SummaryMetrics: React.FC<Properties> = ({ dashboard }: Properties) => {
	const { distribution, summary } = dashboard;

	const scoredCount = getScoredCount(distribution);
	const scoreChange = formatScoreChange(summary.weeklyChange);
	const hasAverage = summary.averageScore !== null;

	return (
		<section aria-label={AnalyticLabel.KPI_SECTION}>
			<dl className={styles["metrics"]}>
				<MetricCard
					caption={AnalyticLabel.KPI_SCORED_CAPTION}
					label={AnalyticLabel.KPI_SCORED_LABEL}
					tone={MetricTone.ACCENT}
					value={String(scoredCount)}
				/>
				<MetricCard
					caption={hasAverage ? AnalyticLabel.KPI_AVERAGE_CAPTION : ""}
					label={AnalyticLabel.KPI_AVERAGE_LABEL}
					tone={MetricTone.ACCENT}
					value={formatScore(summary.averageScore)}
				/>
				<MetricCard
					caption={scoreChange.caption}
					label={AnalyticLabel.KPI_CHANGE_LABEL}
					tone={scoreChange.tone}
					value={scoreChange.value}
				/>
				<MetricCard
					caption={AnalyticLabel.KPI_KEYWORDS_CAPTION}
					label={AnalyticLabel.KPI_KEYWORDS_LABEL}
					tone={MetricTone.NEUTRAL}
					value={String(summary.keywordCount)}
				/>
			</dl>
		</section>
	);
};

export { SummaryMetrics };
