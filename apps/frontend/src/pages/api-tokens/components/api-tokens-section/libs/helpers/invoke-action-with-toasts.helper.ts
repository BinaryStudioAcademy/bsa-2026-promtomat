import {
	showNotification,
	ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

type Parameters<T> = {
	action: Promise<T>;
	errorMessage: ShowNotificationPayload;
	finalize: () => void;
	successMessage: ShowNotificationPayload;
};

const invokeActionWithToasts = async <T>({
	action,
	errorMessage,
	finalize,
	successMessage,
}: Parameters<T>) => {
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
