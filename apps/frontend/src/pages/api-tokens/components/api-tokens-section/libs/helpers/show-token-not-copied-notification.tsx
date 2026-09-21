import { showNotification } from "~/libs/modules/notification/notification.js";

import { ApiTokensNotification } from "../enums/enums.js";

const showTokenNotCopiedNotification = () => {
	showNotification(ApiTokensNotification.CLOSED_WITHOUT_COPY);
};

export { showTokenNotCopiedNotification };
