import { type RefObject } from "react";

import { NOTIFICATION_ID_INCREMENT } from "../constants/constants.js";

const generateNotificationId = (
	counterReference: RefObject<number>,
): string => {
	counterReference.current += NOTIFICATION_ID_INCREMENT;

	return `notification-${String(counterReference.current)}`;
};

export { generateNotificationId };
