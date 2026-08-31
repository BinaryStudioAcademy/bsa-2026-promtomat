import { type ShowNotificationPayload } from "~/libs/modules/notification/notification.js";

type OverlayHostContext = {
	blockingElement: HTMLElement | null;
	registerBlocking: (id: string) => void;
	showNotification: (payload: ShowNotificationPayload) => void;
	topBlockingId: null | string;
	unregisterBlocking: (id: string) => void;
};

export { type OverlayHostContext };
