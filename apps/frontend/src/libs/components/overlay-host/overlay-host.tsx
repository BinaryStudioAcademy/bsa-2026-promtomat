import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Notification } from "~/libs/components/notification/notification.js";
import {
	bindShowNotification,
	showNotification,
	type ShowNotificationPayload,
} from "~/libs/modules/notification/notification.js";

import {
	BLOCKING_IDS_EMPTY_LENGTH,
	LAST_INDEX_FROM_END,
	NOTIFICATION_DURATION_MS,
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
	const timeoutIdsReference = useRef<Set<ReturnType<typeof setTimeout>>>(
		new Set(),
	);

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
		setNotifications((currentNotifications) => {
			return currentNotifications.filter((item) => item.id !== id);
		});
	}, []);

	const handleShowNotification = useCallback(
		(payload: ShowNotificationPayload) => {
			const id = crypto.randomUUID();

			setNotifications((currentNotifications) => [
				...currentNotifications,
				{
					id,
					message: payload.message,
				},
			]);

			const timeoutId = setTimeout(() => {
				timeoutIdsReference.current.delete(timeoutId);
				dismissNotification(id);
			}, NOTIFICATION_DURATION_MS);

			timeoutIdsReference.current.add(timeoutId);
		},
		[dismissNotification],
	);

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
			for (const timeoutId of timeoutIds) {
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
					<div className={styles["overlay-host-notifications"]}>
						{notifications.map((item) => (
							<Notification key={item.id} message={item.message} />
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
