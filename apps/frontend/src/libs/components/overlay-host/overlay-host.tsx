import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { BLOCKING_IDS_EMPTY_LENGTH, LAST_INDEX_FROM_END } from "./libs/constants/constants.js";
import { lockPage } from "./libs/helpers/lock-page.helper.js";
import { overlayHostContext } from "./overlay-host.context.js";
import "./overlay-host.css";

type Properties = {
	children: React.ReactNode;
};

const OverlayHost = ({ children }: Properties) => {
	const [blockingElement, setBlockingElement] = useState<HTMLDivElement | null>(
		null,
	);
	const [blockingIds, setBlockingIds] = useState<string[]>([]);
	const [notificationsElement, setNotificationsElement] =
		useState<HTMLDivElement | null>(null);

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

	useEffect(() => {
		if (!hasBlocking) {
			return;
		}

		return lockPage();
	}, [hasBlocking]);

	const overlayHost = useMemo(() => {
		return {
			blockingElement,
			notificationsElement,
			registerBlocking,
			topBlockingId: blockingIds.at(LAST_INDEX_FROM_END) ?? null,
			unregisterBlocking,
		};
	}, [
		blockingElement,
		blockingIds,
		notificationsElement,
		registerBlocking,
		unregisterBlocking,
	]);

	return (
		<overlayHostContext.Provider value={overlayHost}>
			{children}
			{createPortal(
				<div className="overlay-host">
					<div className="overlay-host-blocking" ref={setBlockingElement} />
					<div
						className="overlay-host-notifications"
						ref={setNotificationsElement}
					/>
				</div>,
				document.body,
			)}
		</overlayHostContext.Provider>
	);
};

export { OverlayHost };
export { useOverlayHost } from "./libs/hooks/use-overlay-host.hook.js";
