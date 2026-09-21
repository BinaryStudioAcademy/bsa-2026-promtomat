import { showNotification } from "~/libs/modules/notification/notification.js";

import { UNCOPIED_TOKEN_NOTIFICATION } from "../constants/constants.js";

const showTokenNotCopiedNotification = () => {
	showNotification(UNCOPIED_TOKEN_NOTIFICATION);
};

export { showTokenNotCopiedNotification };
