import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type NotificationType } from "../../overlay-host/libs/types/types.js";

const notificationTypeToIconName = {
	danger: IconName.CIRCLE_X,
	info: IconName.INFO,
	success: IconName.CHECK_CIRCLE,
	warning: IconName.ALERT_CIRCLE,
} satisfies Record<NotificationType, ValueOf<typeof IconName>>;

export { notificationTypeToIconName };
