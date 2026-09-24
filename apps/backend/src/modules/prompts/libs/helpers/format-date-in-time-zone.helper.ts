import { Locale } from "~/libs/enums/enums.js";

const findPart = (
	parts: Intl.DateTimeFormatPart[],
	type: Intl.DateTimeFormatPartTypes,
): string => {
	return parts.find((part) => part.type === type)?.value ?? "";
};

const formatDateInTimeZone = (date: Date, timeZone: string): string => {
	const parts = new Intl.DateTimeFormat(Locale.EN_US, {
		day: "2-digit",
		month: "2-digit",
		timeZone,
		year: "numeric",
	}).formatToParts(date);

	return `${findPart(parts, "year")}-${findPart(parts, "month")}-${findPart(parts, "day")}`;
};

export { formatDateInTimeZone };
