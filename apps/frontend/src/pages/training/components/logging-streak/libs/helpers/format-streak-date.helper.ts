import { STREAK_LOCALE } from "../constants/constants.js";
import { OrdinalSuffix } from "../enums/enums.js";
import { checkIsCalendarDate } from "./check-is-calendar-date.helper.js";

const monthFormatter = new Intl.DateTimeFormat(STREAK_LOCALE, {
	month: "long",
	timeZone: "UTC",
});

const ordinalRules = new Intl.PluralRules(STREAK_LOCALE, { type: "ordinal" });

const formatStreakDate = (date: string): string => {
	if (!checkIsCalendarDate(date)) {
		return date;
	}

	const parsedDate = new Date(date);
	const dayOfMonth = parsedDate.getUTCDate();
	const suffix = OrdinalSuffix[ordinalRules.select(dayOfMonth)];

	return `${monthFormatter.format(parsedDate)} ${String(dayOfMonth)}${suffix}`;
};

export { formatStreakDate };
