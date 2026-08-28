import { Modal } from "~/libs/components/modal/modal.js";

import { ConfirmationLabel } from "./libs/enums/enums.js";
import "./confirmation.css";

type Properties = {
	cancelLabel?: string;
	children: React.ReactNode;
	confirmLabel?: string;
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title: string;
};

const Confirmation = ({
	cancelLabel = ConfirmationLabel.CANCEL,
	children,
	confirmLabel = ConfirmationLabel.CONFIRM,
	isOpen,
	onCancel,
	onConfirm,
	title,
}: Properties) => {
	return (
		<Modal
			isDismissible={false}
			isOpen={isOpen}
			onClose={onCancel}
			role="alertdialog"
			title={title}
		>
			{children}
			<div className="confirmation-actions">
				<button onClick={onCancel} type="button">
					{cancelLabel}
				</button>
				<button onClick={onConfirm} type="button">
					{confirmLabel}
				</button>
			</div>
		</Modal>
	);
};

export { Confirmation };
