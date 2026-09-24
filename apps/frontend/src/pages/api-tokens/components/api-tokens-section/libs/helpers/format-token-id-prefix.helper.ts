import {
	TOKEN_ID_PREFIX_LENGTH,
	TOKEN_ID_PREFIX_START,
} from "../constants/constants.js";

const formatTokenIdPrefix = (id: string): string => {
	return `${id.slice(TOKEN_ID_PREFIX_START, TOKEN_ID_PREFIX_LENGTH)}…`;
};

export { formatTokenIdPrefix };
