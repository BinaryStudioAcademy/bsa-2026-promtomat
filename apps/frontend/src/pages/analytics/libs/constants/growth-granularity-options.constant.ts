import { type SegmentedControlOption } from "~/libs/components/segmented-control/libs/types/types.js";
import { AnalyticsGrowthBucket } from "~/modules/analytics/libs/enums/enums.js";
import { type AnalyticsGranularity } from "~/modules/analytics/libs/types/types.js";

const GROWTH_GRANULARITY_OPTIONS: SegmentedControlOption<AnalyticsGranularity>[] =
	[
		{ label: "Day", value: AnalyticsGrowthBucket.DAY },
		{ label: "Week", value: AnalyticsGrowthBucket.WEEK },
		{ label: "Month", value: AnalyticsGrowthBucket.MONTH },
	];

export { GROWTH_GRANULARITY_OPTIONS };
