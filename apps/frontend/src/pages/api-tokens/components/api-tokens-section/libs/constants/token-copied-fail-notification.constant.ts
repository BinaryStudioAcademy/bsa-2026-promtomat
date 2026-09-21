import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";

const TOKEN_COPIED_FAIL_NOTIFICATION = {
	message: ApiTokensMessage.COPY_FAILED,
	type: "danger",
} as ShowNotificationPayload;

export { TOKEN_COPIED_FAIL_NOTIFICATION };
