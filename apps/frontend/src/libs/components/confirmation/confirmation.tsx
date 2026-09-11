import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { ButtonVariant, type IconName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { ConfirmationLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	cancelLabel?: string;
	children: React.ReactNode;
	confirmLabel?: string;
	confirmVariant?: ValueOf<typeof ButtonVariant>;
	isDisabled?: boolean;
	isLoading?: boolean;
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title: string;
	titleIconName?: ValueOf<typeof IconName>;
	tone?: "danger" | "default";
};

const Confirmation = ({
	cancelLabel = ConfirmationLabel.CANCEL,
	children,
	confirmLabel = ConfirmationLabel.CONFIRM,
	confirmVariant = ButtonVariant.PRIMARY,
	isDisabled = false,
	isLoading = false,
	isOpen,
	onCancel,
	onConfirm,
	title,
	titleIconName,
	tone = "default",
}: Properties) => {
	return (
		<Modal
			footer={
				<div className={styles["confirmation-actions"]}>
					<Button
						isDisabled={isDisabled}
						label={cancelLabel}
						onClick={onCancel}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
					<Button
						isDisabled={isDisabled}
						isLoading={isLoading}
						label={confirmLabel}
						onClick={onConfirm}
						type="button"
						variant={confirmVariant}
					/>
				</div>
			}
			isDismissible={false}
			isOpen={isOpen}
			onClose={onCancel}
			role="alertdialog"
			title={title}
			titleIconName={titleIconName}
			tone={tone}
		>
			{children}
		</Modal>
	);
};

export { Confirmation };
