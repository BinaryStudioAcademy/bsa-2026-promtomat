import { type ShowNotificationPayload } from "./libs/types/types.js";

type ShowNotification = (payload: ShowNotificationPayload) => void;

const notificationBinding: { handler: null | ShowNotification } = {
	handler: null,
};

const bindShowNotification = (handler: ShowNotification): VoidFunction => {
	notificationBinding.handler = handler;

	return () => {
		notificationBinding.handler = null;
	};
};

const showNotification = (payload: ShowNotificationPayload): void => {
	notificationBinding.handler?.(payload);
};

export { bindShowNotification, showNotification };
export { type ShowNotificationPayload } from "./libs/types/types.js";
