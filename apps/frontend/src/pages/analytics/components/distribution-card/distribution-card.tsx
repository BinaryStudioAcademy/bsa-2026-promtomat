import React from "react";

import { type AnalyticsDistributionResponseDto } from "~/modules/analytics/libs/types/types.js";

import {
	DISTRIBUTION_TIERS,
	SINGLE_SCORED_COUNT,
} from "../../libs/constants/constants.js";
import { AnalyticLabel } from "../../libs/enums/enums.js";
import { getScoredCount } from "../../libs/helpers/get-scored-count.helper.js";
import { DashboardCard } from "../dashboard-card/dashboard-card.js";
import { DistributionBar } from "../distribution-bar/distribution-bar.js";
import styles from "./styles.module.css";

type Properties = {
	distribution: AnalyticsDistributionResponseDto;
};

const DistributionCard: React.FC<Properties> = ({
	distribution,
}: Properties) => {
	const scoredCount = getScoredCount(distribution);
	const totalCaption =
		scoredCount === SINGLE_SCORED_COUNT
			? AnalyticLabel.DISTRIBUTION_TOTAL_ONE
			: AnalyticLabel.DISTRIBUTION_TOTAL_MANY;

	return (
		<DashboardCard
			aside={
				<p className={styles["total"]}>
					{scoredCount} {totalCaption}
				</p>
			}
			title={AnalyticLabel.DISTRIBUTION_TITLE}
		>
			<ul className={styles["list"]}>
				{DISTRIBUTION_TIERS.map(({ description, key, label, range, tone }) => (
					<DistributionBar
						count={distribution[key].count}
						description={description}
						key={key}
						label={label}
						percentage={distribution[key].percentage}
						range={range}
						tone={tone}
					/>
				))}
			</ul>
		</DashboardCard>
	);
};

export { DistributionCard };
