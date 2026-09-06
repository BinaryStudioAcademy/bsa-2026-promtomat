import { Icon } from "~/libs/components/icon/icon.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { type NotificationItem } from "../overlay-host/libs/types/types.js";
import { notificationTypeToIconName } from "./libs/maps.js";
import styles from "./styles.module.css";

type Properties = {
	item: NotificationItem;
};

const Notification = ({ item: { isClosing, message, type } }: Properties) => {
	return (
		<div
			className={getValidClasses(
				styles["notification"],
				isClosing && styles["closing"],
			)}
		>
			<Icon
				className={styles[type]}
				iconName={notificationTypeToIconName[type]}
			/>
			<p className={styles["message"]}>{message}</p>
		</div>
	);
};

export { Notification };
