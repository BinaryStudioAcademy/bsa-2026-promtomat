import { FALLBACK_TIME_ZONE } from "../constants/constants.js";
import { formatDateInTimeZone } from "./format-date-in-time-zone.helper.js";

const resolveTimeZone = (timeZone: string): string => {
	try {
		formatDateInTimeZone(new Date(), timeZone);

		return timeZone;
	} catch {
		return FALLBACK_TIME_ZONE;
	}
};

export { resolveTimeZone };
