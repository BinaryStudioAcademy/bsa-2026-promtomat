import { showNotification } from "~/libs/modules/notification/notification.js";

import { ApiTokensNotification } from "../enums/enums.js";

const showTokenCopiedNotification = (isCopySuccessful: boolean) => {
	showNotification(
		isCopySuccessful
			? ApiTokensNotification.COPY_SUCCEEDED
			: ApiTokensNotification.COPY_FAILED,
	);
};

export { showTokenCopiedNotification };
