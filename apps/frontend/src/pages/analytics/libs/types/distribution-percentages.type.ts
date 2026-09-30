import { type AnalyticsDistributionResponseDto } from "~/modules/analytics/libs/types/types.js";

type DistributionPercentages = Record<
	keyof AnalyticsDistributionResponseDto,
	number
>;

export { type DistributionPercentages };
