import { EXPIRATION_DATE_FORMAT } from "../constants/constants.js";

const formatExpirationDate = (isoDate: string): string => {
	return new Date(isoDate).toLocaleDateString(
		undefined,
		EXPIRATION_DATE_FORMAT,
	);
};

export { formatExpirationDate };
