import {
	showNotification,
	ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

/* eslint-disable unicorn/prefer-await */
const invokeAction = <T>(
	action: Promise<T>,
	success: (created: T) => void,
	errorMessage: ShowNotificationPayload,
) => {
	return action.then(success).catch(() => {
		showNotification(errorMessage);
	});
};

export { invokeAction };
