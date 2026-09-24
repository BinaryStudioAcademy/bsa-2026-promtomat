import { STREAK_DATE_LOCALE } from "../constants/constants.js";

const formatDateInTimeZone = (date: Date, timeZone: string): string => {
	return new Intl.DateTimeFormat(STREAK_DATE_LOCALE, { timeZone }).format(date);
};

export { formatDateInTimeZone };
