import { DEFAULT_TIME_ZONE, SINGLE_DAY } from "../constants/constants.js";
import { formatDateInTimeZone } from "./format-date-in-time-zone.helper.js";

const getPreviousDate = (date: string): string => {
	const parsed = new Date(date);

	parsed.setUTCDate(parsed.getUTCDate() - SINGLE_DAY);

	return formatDateInTimeZone(parsed, DEFAULT_TIME_ZONE);
};

export { getPreviousDate };
