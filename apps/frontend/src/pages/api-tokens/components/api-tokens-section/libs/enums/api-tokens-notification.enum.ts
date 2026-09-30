import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { type ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { UNCOPIED_NOTIFICATION_DURATION_MS } from "../constants/constants.js";
import { ApiTokensMessage } from "./api-tokens-message.enum.js";

const ApiTokensNotification = {
	CLOSED_WITHOUT_COPY: {
		duration: UNCOPIED_NOTIFICATION_DURATION_MS,
		message: ApiTokensMessage.CLOSE_WITHOUT_COPY,
		type: NotificationType.WARNING,
	},
	COPY_FAILED: {
		message: ApiTokensMessage.COPY_FAILED,
		type: NotificationType.DANGER,
	},
	COPY_SUCCEEDED: {
		message: ApiTokensMessage.COPIED,
		type: NotificationType.SUCCESS,
	},
	CREATE_FAILED: {
		message: ApiTokensMessage.CREATE_ERROR,
		type: NotificationType.DANGER,
	},
	REVOKE_FAILED: {
		message: ApiTokensMessage.REVOKE_ERROR,
		type: NotificationType.DANGER,
	},
	REVOKE_SUCCEEDED: {
		message: ApiTokensMessage.REVOKED,
		type: NotificationType.SUCCESS,
	},
} as const satisfies Record<string, ShowNotificationPayload>;

export { ApiTokensNotification };
