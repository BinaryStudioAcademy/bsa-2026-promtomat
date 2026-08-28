import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
} from "react";
import { createPortal } from "react-dom";

import { useOverlayHost } from "~/libs/components/overlay-host/overlay-host.js";

import {
	FIRST_INDEX,
	LAST_INDEX_FROM_END,
	ModalTabIndex,
} from "./libs/constants/constants.js";
import { KeyboardKey, ModalLabel } from "./libs/enums/enums.js";
import { getFocusableElements } from "./libs/helpers/get-focusable-elements.helper.js";
import "./modal.css";

type Properties = {
	children: React.ReactNode;
	isDismissible?: boolean;
	isOpen: boolean;
	onClose: () => void;
	role?: "alertdialog" | "dialog";
	title: string;
};

const Modal = ({
	children,
	isDismissible = true,
	isOpen,
	onClose,
	role = "dialog",
	title,
}: Properties) => {
	const modalId = useId();
	const titleId = `${modalId}-title`;
	const dialogElementReference = useRef<HTMLDivElement | null>(null);
	const {
		blockingElement,
		registerBlocking,
		topBlockingId,
		unregisterBlocking,
	} = useOverlayHost();
	const isTopBlocking = topBlockingId === modalId;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		registerBlocking(modalId);

		return () => {
			unregisterBlocking(modalId);
		};
	}, [isOpen, modalId, registerBlocking, unregisterBlocking]);

	useLayoutEffect(() => {
		if (!isOpen) {
			return;
		}

		const triggerElement =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		dialogElementReference.current?.focus();

		return () => {
			triggerElement?.focus();
		};
	}, [isOpen]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === KeyboardKey.ESCAPE) {
				if (isDismissible) {
					event.preventDefault();
					onClose();
				}

				return;
			}

			if (event.key !== KeyboardKey.TAB) {
				return;
			}

			const dialogElement = dialogElementReference.current;

			if (dialogElement === null) {
				return;
			}

			const focusableElements = getFocusableElements(dialogElement);
			const firstElement = focusableElements[FIRST_INDEX];
			const lastElement = focusableElements.at(LAST_INDEX_FROM_END);

			if (firstElement === undefined || lastElement === undefined) {
				event.preventDefault();
				dialogElement.focus();
				return;
			}

			const isShiftTab = event.shiftKey;
			const { activeElement } = document;

			if (isShiftTab && activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
				return;
			}

			if (!isShiftTab && activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		},
		[isDismissible, onClose],
	);

	useEffect(() => {
		if (!isOpen || !isTopBlocking) {
			return;
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown, isOpen, isTopBlocking]);

	if (!isOpen || blockingElement === null) {
		return null;
	}

	return createPortal(
		<div className="modal-layer" inert={!isTopBlocking}>
			{isDismissible ? (
				<button
					aria-label={ModalLabel.CLOSE}
					className="modal-backdrop"
					onClick={onClose}
					type="button"
				/>
			) : (
				<div className="modal-backdrop modal-backdrop-static" />
			)}
			<div
				aria-labelledby={titleId}
				aria-modal="true"
				className="modal"
				ref={dialogElementReference}
				role={role}
				tabIndex={ModalTabIndex.CONTAINER}
			>
				<h2 id={titleId}>{title}</h2>
				{isDismissible && (
					<button onClick={onClose} type="button">
						Close
					</button>
				)}
				{children}
			</div>
		</div>,
		blockingElement,
	);
};

export { Modal };
