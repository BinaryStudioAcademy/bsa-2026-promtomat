import { ApiTokensMessage } from "../enums/enums.js";

const API_TOKENS_TABLE_COLUMNS = [
	ApiTokensMessage.COLUMN_NAME,
	ApiTokensMessage.COLUMN_LAST_USED,
	ApiTokensMessage.COLUMN_EXPIRES,
	ApiTokensMessage.COLUMN_STATUS,
] as const;

export { API_TOKENS_TABLE_COLUMNS };
