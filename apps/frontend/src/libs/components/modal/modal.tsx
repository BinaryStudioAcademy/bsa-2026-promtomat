import { useCallback, useEffect, useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "~/libs/components/button/button.js";
import { useOverlayHost } from "~/libs/components/overlay-host/overlay-host.js";
import { KeyboardKey } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import {
	FIRST_INDEX,
	LAST_INDEX_FROM_END,
} from "./libs/constants/constants.js";
import { ModalLabel } from "./libs/enums/enums.js";
import { getFocusableElements } from "./libs/helpers/get-focusable-elements.helper.js";
import styles from "./styles.module.css";

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
		if (!isOpen || blockingElement === null) {
			return;
		}

		const dialogElement = dialogElementReference.current;

		if (dialogElement === null) {
			return;
		}

		const triggerElement =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		const [firstElement] = getFocusableElements(dialogElement);
		firstElement?.focus();

		return () => {
			triggerElement?.focus();
		};
	}, [blockingElement, isOpen]);

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
		<div className={styles["modal-layer"]} inert={!isTopBlocking}>
			{isDismissible ? (
				<Button
					className={getValidClasses(styles["modal-backdrop"])}
					label={ModalLabel.CLOSE_DIALOG}
					onClick={onClose}
					type="button"
				/>
			) : (
				<div
					className={getValidClasses(
						styles["modal-backdrop"],
						styles["modal-backdrop-static"],
					)}
				/>
			)}
			<div
				aria-labelledby={titleId}
				aria-modal="true"
				className={styles["modal"]}
				ref={dialogElementReference}
				role={role}
			>
				<div>
					<h2 className={styles["modal-title"]} id={titleId}>
						{title}
					</h2>
				</div>
				{children}
			</div>
		</div>,
		blockingElement,
	);
};

export { Modal };
