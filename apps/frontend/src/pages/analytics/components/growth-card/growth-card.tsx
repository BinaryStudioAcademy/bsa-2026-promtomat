import React, { useMemo } from "react";

import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import {
	type AnalyticsGranularity,
	type AnalyticsGrowthResponseDto,
} from "~/modules/analytics/libs/types/types.js";

import { GROWTH_GRANULARITY_OPTIONS } from "../../libs/constants/constants.js";
import { AnalyticLabel } from "../../libs/enums/enums.js";
import { getGrowthEmptyReason } from "../../libs/helpers/get-growth-empty-reason.helper.js";
import { getGrowthSummary } from "../../libs/helpers/get-growth-summary.helper.js";
import { getGrowthTrendHint } from "../../libs/helpers/get-growth-trend-hint.helper.js";
import { DashboardCard } from "../dashboard-card/dashboard-card.js";
import { GrowthChart } from "../growth-chart/growth-chart.js";
import { GrowthFooter } from "../growth-footer/growth-footer.js";
import styles from "./styles.module.css";

type Properties = {
	granularity: AnalyticsGranularity;
	growth: AnalyticsGrowthResponseDto;
	isRefreshing: boolean;
	onGranularityChange: (granularity: AnalyticsGranularity) => void;
};

const GrowthCard: React.FC<Properties> = ({
	granularity,
	growth,
	isRefreshing,
	onGranularityChange,
}: Properties) => {
	const summary = useMemo(
		() => getGrowthSummary(growth.points),
		[growth.points],
	);

	return (
		<DashboardCard
			aside={
				<SegmentedControl
					label={AnalyticLabel.GROWTH_FIELD}
					onChange={onGranularityChange}
					options={GROWTH_GRANULARITY_OPTIONS}
					value={granularity}
				/>
			}
			title={AnalyticLabel.GROWTH_TITLE}
		>
			<div
				aria-busy={isRefreshing}
				className={getValidClasses(
					styles["body"],
					isRefreshing && styles["refreshing"],
				)}
			>
				{summary.hasData ? (
					<>
						<GrowthChart
							granularity={granularity}
							points={growth.points}
							summary={summary}
						/>
						{!summary.hasTrend && (
							<p className={styles["hint"]}>
								{getGrowthTrendHint(granularity)}
							</p>
						)}
					</>
				) : (
					<div className={styles["empty"]}>
						<p className={styles["empty-title"]}>
							{AnalyticLabel.GROWTH_EMPTY}
						</p>
						<p className={styles["hint"]}>
							{getGrowthEmptyReason(growth.points.length, granularity)}
						</p>
					</div>
				)}
			</div>
			<GrowthFooter
				count={growth.points.length}
				granularity={granularity}
				summary={summary}
			/>
		</DashboardCard>
	);
};

export { GrowthCard };
