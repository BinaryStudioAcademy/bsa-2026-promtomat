import { STREAK_LOCALE } from "~/pages/training/components/logging-streak/libs/constants/constants.js";
import { OrdinalSuffix } from "~/pages/training/components/logging-streak/libs/enums/enums.js";

const monthFormatter = new Intl.DateTimeFormat(STREAK_LOCALE, {
	month: "long",
	timeZone: "UTC",
});

const ordinalRules = new Intl.PluralRules(STREAK_LOCALE, { type: "ordinal" });

const formatStreakDate = (date: string): string => {
	const parsedDate = new Date(date);
	const dayOfMonth = parsedDate.getUTCDate();
	const suffix = OrdinalSuffix[ordinalRules.select(dayOfMonth)];

	return `${monthFormatter.format(parsedDate)} ${String(dayOfMonth)}${suffix}`;
};

export { formatStreakDate };
