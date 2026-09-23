import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";

const GrowthBucketConfig = {
	[AnalyticsGrowthBucket.DAY]: { count: 7, unit: "day" },
	[AnalyticsGrowthBucket.MONTH]: { count: 6, unit: "month" },
	[AnalyticsGrowthBucket.WEEK]: { count: 8, unit: "week" },
} as const;

export { GrowthBucketConfig };
