import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type NotificationType } from "../../overlay-host/libs/types/types.js";

const notificationTypeToIconName = {
	error: IconName.CIRCLE_X,
	info: IconName.INFO,
	message: null,
	warning: IconName.ALERT_CIRCLE,
} satisfies Record<NotificationType, null | ValueOf<typeof IconName>>;

export { notificationTypeToIconName };
