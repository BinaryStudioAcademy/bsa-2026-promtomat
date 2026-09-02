import { type NotificationType } from "./notification-type.type.js";

type NotificationItem = {
	id: string;
	isClosing: boolean;
	message: string;
	type: NotificationType;
};

export { type NotificationItem };
