import { z } from "zod";

import { AnalyticsGrowthBucket } from "../enums/enums.js";

const analyticsQuery = z.object({
	granularity: z
		.enum([
			AnalyticsGrowthBucket.DAY,
			AnalyticsGrowthBucket.MONTH,
			AnalyticsGrowthBucket.WEEK,
		])
		.optional()
		.default(AnalyticsGrowthBucket.WEEK),
	workspaceId: z.coerce.number().int().positive().optional(),
});

export { analyticsQuery };
