import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type ShowNotificationPayload = {
	duration?: number;
	id?: string;
	message: string;
	type?: ValueOf<typeof NotificationType>;
};

export { type ShowNotificationPayload };
