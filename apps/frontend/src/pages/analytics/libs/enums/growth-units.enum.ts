import { AnalyticsGrowthBucket } from "~/modules/analytics/libs/enums/enums.js";

const GrowthUnits = {
	[AnalyticsGrowthBucket.DAY]: {
		current: "today",
		plural: "days",
		suffix: "d",
	},
	[AnalyticsGrowthBucket.MONTH]: {
		current: "now",
		plural: "months",
		suffix: "mo",
	},
	[AnalyticsGrowthBucket.WEEK]: {
		current: "now",
		plural: "weeks",
		suffix: "w",
	},
} as const;

export { GrowthUnits };
