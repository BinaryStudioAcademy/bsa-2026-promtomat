import { Locale } from "~/libs/enums/enums.js";

const expirationDateFormatter = new Intl.DateTimeFormat(Locale.EN_US, {
	day: "numeric",
	month: "short",
	year: "numeric",
});

const formatExpirationDate = (isoDate: string): string => {
	return expirationDateFormatter.format(new Date(isoDate));
};

export { formatExpirationDate };
