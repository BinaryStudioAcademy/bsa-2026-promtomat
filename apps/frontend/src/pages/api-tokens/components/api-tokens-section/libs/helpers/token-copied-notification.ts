import { showNotification } from "~/libs/modules/notification/notification.js";

import {
	TOKEN_COPIED_FAIL_NOTIFICATION,
	TOKEN_COPIED_SUCCESS_NOTIFICATION,
} from "../constants/constants.js";

const showTokenCopiedNotification = (isCopySuccessful: boolean) => {
	showNotification(
		isCopySuccessful
			? TOKEN_COPIED_SUCCESS_NOTIFICATION
			: TOKEN_COPIED_FAIL_NOTIFICATION,
	);
};

export { showTokenCopiedNotification };
