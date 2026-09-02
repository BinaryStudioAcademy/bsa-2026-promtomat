import { useCallback } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { type NotificationItem } from "../overlay-host/libs/types/types.js";
import { NOTIFICATION_CLOSE_LABEL } from "./libs/constants/constants.js";
import { notificationTypeToIconName } from "./libs/maps.js";
import styles from "./styles.module.css";

type Properties = {
	item: NotificationItem;
	onClose: (id: string) => void;
};

const Notification = ({ item: { id, message, type }, onClose }: Properties) => {
	const iconName = notificationTypeToIconName[type];

	const handleClose = useCallback((): void => {
		onClose(id);
	}, [id, onClose]);

	return (
		<div className={styles["notification-container"]}>
			<div className={styles["notification"]}>
				<button
					aria-label={NOTIFICATION_CLOSE_LABEL}
					className={styles["close"]}
					onClick={handleClose}
					type="button"
				>
					<Icon iconName={IconName.CLOSE} />
				</button>
				<div className={styles["message"]}>
					{iconName === null ? null : (
						<Icon
							className={getValidClasses(styles["icon"], styles[type])}
							iconName={iconName}
						/>
					)}
					{message}
				</div>
			</div>
		</div>
	);
};

export { Notification };
