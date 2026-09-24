import { type ValueOf } from "~/libs/types/types.js";

import { type AnalyticsGrowthBucket } from "../enums/enums.js";

type AnalyticsGranularity = ValueOf<typeof AnalyticsGrowthBucket>;

export { type AnalyticsGranularity };
