import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";

const REVOKE_TOKEN_SUCCESS_NOTIFICATION = {
	message: ApiTokensMessage.REVOKED,
	type: "success",
} as ShowNotificationPayload;

export { REVOKE_TOKEN_SUCCESS_NOTIFICATION };
