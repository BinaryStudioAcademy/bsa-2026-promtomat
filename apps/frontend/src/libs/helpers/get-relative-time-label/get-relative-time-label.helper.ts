const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINIMUM_UNIT = 1;

const getRelativeTimeLabel = (isoDate: string): string => {
	const diffMinutes = Math.floor(
		(Date.now() - new Date(isoDate).getTime()) / MS_PER_MINUTE,
	);

	if (diffMinutes < MINIMUM_UNIT) {
		return "just now";
	}

	if (diffMinutes < MINUTES_PER_HOUR) {
		return `${String(diffMinutes)} minute${diffMinutes === MINIMUM_UNIT ? "" : "s"} ago`;
	}

	const diffHours = Math.floor(diffMinutes / MINUTES_PER_HOUR);

	if (diffHours < HOURS_PER_DAY) {
		return `${String(diffHours)} hour${diffHours === MINIMUM_UNIT ? "" : "s"} ago`;
	}

	const diffDays = Math.floor(diffHours / HOURS_PER_DAY);

	return `${String(diffDays)} day${diffDays === MINIMUM_UNIT ? "" : "s"} ago`;
};

export { getRelativeTimeLabel };
