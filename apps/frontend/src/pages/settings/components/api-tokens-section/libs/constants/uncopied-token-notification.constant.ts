import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";
import { UNCOPIED_NOTIFICATION_DURATION_MS } from "./uncopied-notification-duration.constant.js";

const UNCOPIED_TOKEN_NOTIFICATION = {
	duration: UNCOPIED_NOTIFICATION_DURATION_MS,
	message: ApiTokensMessage.CLOSE_WITHOUT_COPY,
	type: "warning",
} as ShowNotificationPayload;

export { UNCOPIED_TOKEN_NOTIFICATION };
