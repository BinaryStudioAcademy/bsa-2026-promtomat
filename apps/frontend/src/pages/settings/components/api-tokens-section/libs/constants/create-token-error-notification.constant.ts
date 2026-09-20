import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";

const CREATE_TOKEN_ERROR_NOTIFICATION = {
	message: ApiTokensMessage.CREATE_ERROR,
	type: "danger",
} as ShowNotificationPayload;

export { CREATE_TOKEN_ERROR_NOTIFICATION };
