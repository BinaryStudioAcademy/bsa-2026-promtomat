import { Locale } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { EXPIRATION_DATE_FORMAT } from "../constants/constants.js";

const formatExpirationDate = (
	isoDate: string,
	locale: ValueOf<typeof Locale> = Locale.EN_US,
): string => {
	return new Date(isoDate).toLocaleDateString(locale, EXPIRATION_DATE_FORMAT);
};

export { formatExpirationDate };
