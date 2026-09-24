import { type ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { UNCOPIED_NOTIFICATION_DURATION_MS } from "../constants/constants.js";
import { ApiTokensMessage } from "./api-tokens-message.enum.js";

const ApiTokensNotification = {
	CLOSED_WITHOUT_COPY: {
		duration: UNCOPIED_NOTIFICATION_DURATION_MS,
		message: ApiTokensMessage.CLOSE_WITHOUT_COPY,
		type: "warning",
	},
	COPY_FAILED: {
		message: ApiTokensMessage.COPY_FAILED,
		type: "danger",
	},
	COPY_SUCCEEDED: {
		message: ApiTokensMessage.COPIED,
		type: "success",
	},
	CREATE_FAILED: {
		message: ApiTokensMessage.CREATE_ERROR,
		type: "danger",
	},
	REVOKE_FAILED: {
		message: ApiTokensMessage.REVOKE_ERROR,
		type: "danger",
	},
	REVOKE_SUCCEEDED: {
		message: ApiTokensMessage.REVOKED,
		type: "success",
	},
} as const satisfies Record<string, ShowNotificationPayload>;

export { ApiTokensNotification };
