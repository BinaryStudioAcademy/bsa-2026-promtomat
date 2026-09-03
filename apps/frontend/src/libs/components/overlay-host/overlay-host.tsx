import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Notification } from "~/libs/components/notification/notification.js";
import { KeyboardKey } from "~/libs/enums/enums.js";
import {
	bindShowNotification,
	showNotification,
	type ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

import {
	BLOCKING_IDS_EMPTY_LENGTH,
	DEFAULT_NOTIFICATION_DURATION_MS,
	DEFAULT_NOTIFICATION_TYPE,
	LAST_INDEX_FROM_END,
	NOTIFICATION_CLOSING_DURATION_MS,
} from "./libs/constants/constants.js";
import { lockPage } from "./libs/helpers/lock-page.helper.js";
import { type NotificationItem } from "./libs/types/types.js";
import { overlayHostContext } from "./overlay-host.context.js";
import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
};

const OverlayHost = ({ children }: Properties) => {
	const [blockingElement, setBlockingElement] = useState<HTMLDivElement | null>(
		null,
	);
	const [blockingIds, setBlockingIds] = useState<string[]>([]);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const timeoutIdsReference = useRef<
		Map<string, ReturnType<typeof setTimeout>>
	>(new Map());

	const hasBlocking = blockingIds.length > BLOCKING_IDS_EMPTY_LENGTH;

	const registerBlocking = useCallback((id: string) => {
		setBlockingIds((currentIds) => {
			if (currentIds.includes(id)) {
				return currentIds;
			}

			return [...currentIds, id];
		});
	}, []);

	const unregisterBlocking = useCallback((id: string) => {
		setBlockingIds((currentIds) => {
			return currentIds.filter((currentId) => currentId !== id);
		});
	}, []);

	const dismissNotification = useCallback((id: string) => {
		const timeoutId = timeoutIdsReference.current.get(id);

		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
			timeoutIdsReference.current.delete(id);
		}

		setNotifications((currentNotifications) => {
			return currentNotifications.filter((item) => item.id !== id);
		});
	}, []);

	const scheduleNotificationDismiss = useCallback(
		(notification: NotificationItem) => {
			if (notification.isClosing) {
				return;
			}

			const previousTimeoutId = timeoutIdsReference.current.get(
				notification.id,
			);

			if (previousTimeoutId !== undefined) {
				clearTimeout(previousTimeoutId);
			}

			const timeoutId = setTimeout(() => {
				dismissNotification(notification.id);
			}, NOTIFICATION_CLOSING_DURATION_MS);

			timeoutIdsReference.current.set(notification.id, timeoutId);
		},
		[dismissNotification],
	);

	const dismissNotifications = useCallback(() => {
		for (const notification of notifications) {
			scheduleNotificationDismiss(notification);
		}

		setNotifications((currentNotifications) =>
			currentNotifications.map((notification) => ({
				...notification,
				isClosing: true,
			})),
		);
	}, [scheduleNotificationDismiss, notifications]);

	const handleShowNotification = useCallback(
		(payload: ShowNotificationPayload) => {
			const id = payload.id ?? crypto.randomUUID();

			if (timeoutIdsReference.current.has(id)) {
				return;
			}

			const duration = payload.duration ?? DEFAULT_NOTIFICATION_DURATION_MS;
			const type = payload.type ?? DEFAULT_NOTIFICATION_TYPE;

			setNotifications((currentNotifications) => [
				...currentNotifications,
				{
					id,
					isClosing: false,
					message: payload.message,
					type,
				},
			]);

			const timeoutId = setTimeout(() => {
				dismissNotification(id);
			}, duration);

			timeoutIdsReference.current.set(id, timeoutId);
		},
		[dismissNotification],
	);

	useEffect(() => {
		if (hasBlocking) {
			return;
		}

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === KeyboardKey.ESCAPE) {
				dismissNotifications();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [dismissNotifications, hasBlocking]);

	useEffect(() => {
		if (!hasBlocking) {
			return;
		}

		return lockPage();
	}, [hasBlocking]);

	useEffect(() => {
		return bindShowNotification(handleShowNotification);
	}, [handleShowNotification]);

	useEffect(() => {
		const timeoutIds = timeoutIdsReference.current;

		return () => {
			for (const timeoutId of timeoutIds.values()) {
				clearTimeout(timeoutId);
			}

			timeoutIds.clear();
		};
	}, []);

	const overlayHost = useMemo(() => {
		return {
			blockingElement,
			registerBlocking,
			showNotification,
			topBlockingId: blockingIds.at(LAST_INDEX_FROM_END) ?? null,
			unregisterBlocking,
		};
	}, [blockingElement, blockingIds, registerBlocking, unregisterBlocking]);

	return (
		<overlayHostContext.Provider value={overlayHost}>
			{children}
			{createPortal(
				<div className={styles["overlay-host"]}>
					<div
						className={styles["overlay-host-blocking"]}
						ref={setBlockingElement}
					/>
					<div
						aria-atomic="false"
						aria-live="polite"
						className={styles["overlay-host-notifications"]}
					>
						{notifications.map((item) => (
							<Notification item={item} key={item.id} />
						))}
					</div>
				</div>,
				document.body,
			)}
		</overlayHostContext.Provider>
	);
};

export { OverlayHost };
export { useOverlayHost } from "./libs/hooks/use-overlay-host.hook.js";
