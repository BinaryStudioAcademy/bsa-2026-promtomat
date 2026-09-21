import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { ApiTokenExpiration } from "~/libs/enums/enums.js";

const API_TOKENS_EXPIRATION_SELECT_OPTIONS: SelectOption[] = [
	{ label: "7 days", value: ApiTokenExpiration.ONE_WEEK },
	{ label: "30 days", value: ApiTokenExpiration.ONE_MONTH },
	{ label: "60 days", value: ApiTokenExpiration.TWO_MONTHS },
	{ label: "90 days", value: ApiTokenExpiration.THREE_MONTHS },
	{ label: "Never", value: ApiTokenExpiration.NEVER },
];

export { API_TOKENS_EXPIRATION_SELECT_OPTIONS };
