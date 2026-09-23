import { type ValueOf } from "~/libs/types/types.js";
import { type AnalyticsDistributionResponseDto } from "~/modules/analytics/libs/types/types.js";

import { type ScoreTone } from "../enums/enums.js";

type DistributionTier = {
	description: string;
	key: keyof AnalyticsDistributionResponseDto;
	label: string;
	range: string;
	tone: ValueOf<typeof ScoreTone>;
};

export { type DistributionTier };
