type OverlayHostContext = {
	blockingElement: HTMLElement | null;
	notificationsElement: HTMLElement | null;
	registerBlocking: (id: string) => void;
	topBlockingId: null | string;
	unregisterBlocking: (id: string) => void;
};

export { type OverlayHostContext };
