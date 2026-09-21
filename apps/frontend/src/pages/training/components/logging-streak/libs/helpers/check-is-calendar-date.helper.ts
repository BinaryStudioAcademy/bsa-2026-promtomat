import { CALENDAR_DATE_PATTERN } from "../constants/constants.js";

const checkIsCalendarDate = (date: string): boolean => {
	if (!CALENDAR_DATE_PATTERN.test(date)) {
		return false;
	}

	const parsedDate = new Date(date);

	return (
		!Number.isNaN(parsedDate.getTime()) &&
		parsedDate.toISOString().startsWith(date)
	);
};

export { checkIsCalendarDate };
