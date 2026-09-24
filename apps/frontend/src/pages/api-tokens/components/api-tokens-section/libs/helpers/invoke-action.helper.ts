import {
	showNotification,
	ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

const invokeAction = async <T>(
	action: Promise<T>,
	success: (created: T) => void,
	errorMessage: ShowNotificationPayload,
) => {
	try {
		const result = await action;
		success(result);
	} catch {
		showNotification(errorMessage);
	}
};

export { invokeAction };
