import { type AnalyticsDistributionResponseDto } from "~/modules/analytics/libs/types/types.js";

const getScoredCount = ({
	high,
	low,
	mid,
}: AnalyticsDistributionResponseDto): number => {
	return high.count + low.count + mid.count;
};

export { getScoredCount };
