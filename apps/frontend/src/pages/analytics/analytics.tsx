import React, { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useGetAnalyticsQuery } from "~/modules/analytics/analytics-api.js";
import { useAnalyticsScope } from "~/modules/analytics/libs/hooks/use-analytics-scope/use-analytics-scope.hook.js";
import { type AnalyticsDashboardResponseDto } from "~/modules/analytics/libs/types/types.js";

import { DistributionCard } from "./components/distribution-card/distribution-card.js";
import { GrowthCard } from "./components/growth-card/growth-card.js";
import { KeywordWeightsCard } from "./components/keyword-weights-card/keyword-weights-card.js";
import { ScopeSelect } from "./components/scope-select/scope-select.js";
import { SummaryMetrics } from "./components/summary-metrics/summary-metrics.js";
import { AnalyticLabel } from "./libs/enums/enums.js";
import { getScoredCount } from "./libs/helpers/get-scored-count.helper.js";
import styles from "./styles.module.css";

const Analytics: React.FC = () => {
	const { control, granularity, handleGranularityChange, queryPayload } =
		useAnalyticsScope();
	const { data, isError, isFetching, isLoading, refetch } =
		useGetAnalyticsQuery(queryPayload);

	const [displayedData, setDisplayedData] = useState<
		AnalyticsDashboardResponseDto | undefined
	>(data);

	if (data && data !== displayedData) {
		setDisplayedData(data);
	}

	const isScopeEmpty =
		displayedData !== undefined &&
		getScoredCount(displayedData.distribution) === ZERO_VALUE;
	const hasRefreshError = isError && !isFetching;

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	let content: React.ReactNode;

	if (displayedData) {
		content = (
			<>
				{hasRefreshError && (
					<div className={styles["refresh-error"]} role="alert">
						<span>{AnalyticLabel.REFRESH_ERROR}</span>
						<Button
							label={AnalyticLabel.RETRY}
							onClick={handleRetry}
							size={ControlSize.SM}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</div>
				)}
				{isScopeEmpty && (
					<p className={styles["notice"]} role="status">
						{AnalyticLabel.EMPTY_SCOPE}
					</p>
				)}
				<SummaryMetrics dashboard={displayedData} />
				<DistributionCard distribution={displayedData.distribution} />
				<div className={styles["columns"]}>
					<GrowthCard
						granularity={granularity}
						growth={displayedData.growth}
						isRefreshing={isFetching}
						onGranularityChange={handleGranularityChange}
					/>
					<KeywordWeightsCard keywords={displayedData.keywords} />
				</div>
			</>
		);
	} else if (isLoading) {
		content = <Loader variant={LoaderVariant.SECTION} />;
	} else if (isError) {
		content = <p className={styles["message"]}>{AnalyticLabel.LOAD_ERROR}</p>;
	}

	return (
		<div className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<header className={styles["header"]}>
					<div className={styles["heading"]}>
						<p className={styles["kicker"]}>{AnalyticLabel.KICKER}</p>
						<h1 className={styles["title"]}>{AnalyticLabel.TITLE}</h1>
						<p className={styles["description"]}>{AnalyticLabel.DESCRIPTION}</p>
					</div>
					<div className={styles["scope"]}>
						<ScopeSelect control={control} />
					</div>
				</header>
				{content}
			</div>
		</div>
	);
};

export { Analytics };
