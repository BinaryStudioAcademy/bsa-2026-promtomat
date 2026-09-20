import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";

const REVOKE_TOKEN_ERROR_NOTIFICATION = {
	message: ApiTokensMessage.REVOKE_ERROR,
	type: "danger",
} as ShowNotificationPayload;

export { REVOKE_TOKEN_ERROR_NOTIFICATION };
