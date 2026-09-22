import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";
import { type AnalyticsGrowthPoint, type ValueOf } from "~/libs/types/types.js";

import { GrowthBucketConfig, GrowthGapFillConfig } from "../enums/enums.js";
import { type PromptGrowthRow } from "../types/types.js";

const truncateToUnit = (
	date: Date,
	unit: ValueOf<typeof AnalyticsGrowthBucket>,
): Date => {
	const truncated = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
	);

	if (unit === AnalyticsGrowthBucket.WEEK) {
		const day = truncated.getUTCDay();
		const offsetFromMonday =
			(day === GrowthGapFillConfig.SUNDAY
				? GrowthGapFillConfig.DAYS_PER_WEEK
				: day) - GrowthGapFillConfig.ISO_WEEK_START_DAY;

		truncated.setUTCDate(truncated.getUTCDate() - offsetFromMonday);
	}

	if (unit === AnalyticsGrowthBucket.MONTH) {
		truncated.setUTCDate(GrowthGapFillConfig.ISO_WEEK_START_DAY);
	}

	return truncated;
};

const stepBack = (
	date: Date,
	unit: ValueOf<typeof AnalyticsGrowthBucket>,
	steps: number,
): Date => {
	const stepped = new Date(date);

	if (unit === AnalyticsGrowthBucket.DAY) {
		stepped.setUTCDate(stepped.getUTCDate() - steps);
	}

	if (unit === AnalyticsGrowthBucket.WEEK) {
		stepped.setUTCDate(
			stepped.getUTCDate() - steps * GrowthGapFillConfig.DAYS_PER_WEEK,
		);
	}

	if (unit === AnalyticsGrowthBucket.MONTH) {
		stepped.setUTCMonth(stepped.getUTCMonth() - steps);
	}

	return stepped;
};

const toBucketKey = (date: Date): string => {
	return date
		.toISOString()
		.slice(
			GrowthGapFillConfig.DATE_START_INDEX,
			GrowthGapFillConfig.DATE_LENGTH,
		);
};

const fillGrowthGaps = (
	rows: PromptGrowthRow[],
	granularity: ValueOf<typeof AnalyticsGrowthBucket>,
): AnalyticsGrowthPoint[] => {
	const { count, unit } = GrowthBucketConfig[granularity];
	const averageScoreByBucket = new Map(
		rows.map((row) => [row.bucket, row.averageScore]),
	);
	const currentBucket = truncateToUnit(new Date(), unit);

	const points: AnalyticsGrowthPoint[] = [];

	for (
		let index = GrowthGapFillConfig.FIRST_STEP;
		index < count;
		index += GrowthGapFillConfig.STEP_SIZE
	) {
		const stepsAgo = count - GrowthGapFillConfig.OLDEST_STEP_OFFSET - index;
		const bucketDate = stepBack(currentBucket, unit, stepsAgo);
		const bucketKey = toBucketKey(bucketDate);

		points.push({
			averageScore: averageScoreByBucket.get(bucketKey) ?? null,
			date: bucketKey,
		});
	}

	return points;
};

export { fillGrowthGaps };
