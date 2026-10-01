import React from "react";

import { ScoreValue } from "~/libs/components/score-value/score-value.js";
import { StatCard } from "~/libs/components/stat-card/stat-card.js";
import { StatGrid } from "~/libs/components/stat-grid/stat-grid.js";
import { SCORE_SCALE_CAPTION } from "~/libs/constants/constants.js";
import { type AnalyticsDashboardResponseDto } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel } from "../../libs/enums/enums.js";
import { formatScoreChange } from "../../libs/helpers/format-score-change.helper.js";
import { getScoredCount } from "../../libs/helpers/get-scored-count.helper.js";
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
		<StatGrid label={AnalyticLabel.KPI_SECTION}>
			<StatCard
				caption={AnalyticLabel.KPI_SCORED_CAPTION}
				label={AnalyticLabel.KPI_SCORED_LABEL}
			>
				<span className={styles["accent"]}>{scoredCount}</span>
			</StatCard>
			<StatCard
				caption={hasAverage ? SCORE_SCALE_CAPTION : undefined}
				label={AnalyticLabel.KPI_AVERAGE_LABEL}
			>
				<ScoreValue score={summary.averageScore} />
			</StatCard>
			<StatCard
				caption={scoreChange.caption}
				label={AnalyticLabel.KPI_CHANGE_LABEL}
			>
				<span className={styles[scoreChange.tone]}>{scoreChange.value}</span>
			</StatCard>
			<StatCard
				caption={AnalyticLabel.KPI_KEYWORDS_CAPTION}
				label={AnalyticLabel.KPI_KEYWORDS_LABEL}
			>
				{summary.keywordCount}
			</StatCard>
		</StatGrid>
	);
};

export { SummaryMetrics };
