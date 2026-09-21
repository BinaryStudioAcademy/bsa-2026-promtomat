import {
	showNotification,
	ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

/* eslint-disable unicorn/prefer-await */
/* eslint-disable max-params */
const invokeActionWithToasts = <T>(
	action: Promise<T>,
	successMessage: ShowNotificationPayload,
	errorMessage: ShowNotificationPayload,
	finalize: () => void,
) => {
	return action
		.then(() => {
			showNotification(successMessage);
		})
		.catch(() => {
			showNotification(errorMessage);
		})
		.finally(finalize);
};

export { invokeActionWithToasts };
