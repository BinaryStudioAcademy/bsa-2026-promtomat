import { type NotificationType } from "~/libs/components/overlay-host/libs/types/notification-type.type.js";

type ShowNotificationPayload = {
	duration?: number;
	id?: string;
	message: string;
	type?: NotificationType;
};

export { type ShowNotificationPayload };
