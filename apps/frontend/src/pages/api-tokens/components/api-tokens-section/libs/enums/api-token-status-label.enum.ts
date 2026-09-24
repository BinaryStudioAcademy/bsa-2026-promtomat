import { ApiTokenStatus } from "./api-token-status.enum.js";
import { ApiTokensMessage } from "./api-tokens-message.enum.js";

const ApiTokenStatusLabel = {
	[ApiTokenStatus.ACTIVE]: ApiTokensMessage.STATUS_ACTIVE,
	[ApiTokenStatus.EXPIRED]: ApiTokensMessage.STATUS_EXPIRED,
	[ApiTokenStatus.EXPIRING]: ApiTokensMessage.STATUS_EXPIRING,
} as const;

export { ApiTokenStatusLabel };
