import React from "react";

import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type AnalyticsKeywordResponseDto } from "~/modules/analytics/libs/types/types.js";

import { AnalyticLabel } from "../../libs/enums/enums.js";
import { DashboardCard } from "../dashboard-card/dashboard-card.js";
import { KeywordWeightRow } from "../keyword-weight-row/keyword-weight-row.js";
import styles from "./styles.module.css";

type Properties = {
	keywords: AnalyticsKeywordResponseDto;
};

const KeywordWeightsCard: React.FC<Properties> = ({ keywords }: Properties) => {
	const hasKeywords = keywords.items.length > EMPTY_LENGTH;

	return (
		<DashboardCard
			description={AnalyticLabel.KEYWORDS_DESCRIPTION}
			title={AnalyticLabel.KEYWORDS_TITLE}
		>
			{hasKeywords ? (
				<ul className={styles["list"]}>
					{keywords.items.map(({ averageScore, count, label }, index) => (
						<KeywordWeightRow
							averageScore={averageScore}
							count={count}
							key={`${label}-${String(index)}`}
							label={label}
						/>
					))}
				</ul>
			) : (
				<p className={styles["empty"]}>{AnalyticLabel.KEYWORDS_EMPTY}</p>
			)}
		</DashboardCard>
	);
};

export { KeywordWeightsCard };
