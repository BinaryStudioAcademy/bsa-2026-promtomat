import { type AnalyticsDistributionBand } from "./analytics-distribution-band.type.js";

type AnalyticsDistributionResponseDto = {
	high: AnalyticsDistributionBand;
	low: AnalyticsDistributionBand;
	mid: AnalyticsDistributionBand;
};

export { type AnalyticsDistributionResponseDto };
