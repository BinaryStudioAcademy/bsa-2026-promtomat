import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const notificationTypeToIconName = {
	[NotificationType.DANGER]: IconName.CIRCLE_X,
	[NotificationType.INFO]: IconName.INFO,
	[NotificationType.SUCCESS]: IconName.CHECK_CIRCLE,
	[NotificationType.WARNING]: IconName.ALERT_CIRCLE,
} satisfies Record<ValueOf<typeof NotificationType>, ValueOf<typeof IconName>>;

export { notificationTypeToIconName };
