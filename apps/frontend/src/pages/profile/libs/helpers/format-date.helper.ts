import { Locale } from "~/libs/enums/enums.js";

const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) => {
	return new Date(date).toLocaleDateString(Locale.EN_US, {
		day: "numeric",
		month: "short",
		year: "numeric",
		...options,
	});
};

export { formatDate };
