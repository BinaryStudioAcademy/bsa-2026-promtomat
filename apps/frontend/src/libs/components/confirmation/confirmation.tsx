import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { ButtonVariant } from "~/libs/enums/enums.js";

import { ConfirmationLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

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
			<div className={styles["confirmation-actions"]}>
				<Button
					label={cancelLabel}
					onClick={onCancel}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
				<Button
					label={confirmLabel}
					onClick={onConfirm}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
			</div>
		</Modal>
	);
};

export { Confirmation };
