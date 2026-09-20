import { AnalyticsGrowthBucket } from "~/libs/enums/enums.js";
import { type AnalyticsGrowthPoint, type ValueOf } from "~/libs/types/types.js";

import { GrowthBucketConfig } from "../constants/constants.js";
import { type PromptGrowthRow } from "../types/types.js";

const ISO_WEEK_START_DAY = 1;
const SUNDAY = 0;
const DAYS_PER_WEEK = 7;
const DATE_START_INDEX = 0;
const DATE_LENGTH = 10;
const FIRST_STEP = 0;
const STEP_SIZE = 1;
const OLDEST_STEP_OFFSET = 1;

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
			(day === SUNDAY ? DAYS_PER_WEEK : day) - ISO_WEEK_START_DAY;

		truncated.setUTCDate(truncated.getUTCDate() - offsetFromMonday);
	}

	if (unit === AnalyticsGrowthBucket.MONTH) {
		truncated.setUTCDate(ISO_WEEK_START_DAY);
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
		stepped.setUTCDate(stepped.getUTCDate() - steps * DAYS_PER_WEEK);
	}

	if (unit === AnalyticsGrowthBucket.MONTH) {
		stepped.setUTCMonth(stepped.getUTCMonth() - steps);
	}

	return stepped;
};

const toBucketKey = (date: Date): string => {
	return date.toISOString().slice(DATE_START_INDEX, DATE_LENGTH);
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

	for (let index = FIRST_STEP; index < count; index += STEP_SIZE) {
		const stepsAgo = count - OLDEST_STEP_OFFSET - index;
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
