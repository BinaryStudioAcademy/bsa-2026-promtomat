import { ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

import { ApiTokensMessage } from "../enums/enums.js";

const TOKEN_COPIED_SUCCESS_NOTIFICATION = {
	message: ApiTokensMessage.COPIED,
	type: "success",
} as ShowNotificationPayload;

export { TOKEN_COPIED_SUCCESS_NOTIFICATION };
