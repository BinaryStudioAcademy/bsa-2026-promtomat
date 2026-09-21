import {
	showNotification,
	ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

/* eslint-disable max-params */
const invokeActionWithToasts = async <T>(
	action: Promise<T>,
	successMessage: ShowNotificationPayload,
	errorMessage: ShowNotificationPayload,
	finalize: () => void,
) => {
	try {
		await action;
		showNotification(successMessage);
	} catch {
		showNotification(errorMessage);
	} finally {
		finalize();
	}
};

export { invokeActionWithToasts };
