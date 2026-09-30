import React from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ModalTone } from "~/libs/components/modal/libs/enums/enums.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	confirmLabel?: string;
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	title?: string;
};

const PendingActionConfirmation: React.FC<Properties> = ({
	confirmLabel = GenerateLabel.DISCARD,
	isOpen,
	onCancel,
	onConfirm,
	title = GenerateMessage.DISCARD_TITLE,
}: Properties) => (
	<Confirmation
		confirmLabel={confirmLabel}
		confirmVariant={ButtonVariant.DANGER}
		isOpen={isOpen}
		onCancel={onCancel}
		onConfirm={onConfirm}
		title={title}
		titleIconName={IconName.ALERT_CIRCLE}
		tone={ModalTone.DANGER}
	>
		<p className={styles["consequence"]}>
			{GenerateMessage.DISCARD_EDITS_LOST}
		</p>
	</Confirmation>
);

export { PendingActionConfirmation };
