import { ApiTokenExpiration } from "~/libs/enums/enums.js";

const TOKEN_EXPIRATION_OPTIONS = [
	ApiTokenExpiration.ONE_WEEK,
	ApiTokenExpiration.ONE_MONTH,
	ApiTokenExpiration.TWO_MONTHS,
	ApiTokenExpiration.THREE_MONTHS,
] as const;

const API_TOKENS_EXPIRATION_SELECT_OPTIONS = TOKEN_EXPIRATION_OPTIONS.map(
	(expiration) => ({
		label: `${expiration.toString()} days`,
		value: expiration,
	}),
);

export { API_TOKENS_EXPIRATION_SELECT_OPTIONS };
