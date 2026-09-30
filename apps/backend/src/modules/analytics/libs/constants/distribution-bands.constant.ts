import { type ValueOf } from "~/libs/types/types.js";

import { AnalyticsDistributionAlias } from "../enums/enums.js";

const DISTRIBUTION_BANDS: ValueOf<typeof AnalyticsDistributionAlias>[] = [
	AnalyticsDistributionAlias.HIGH,
	AnalyticsDistributionAlias.MID,
	AnalyticsDistributionAlias.LOW,
];

export { DISTRIBUTION_BANDS };
