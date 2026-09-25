import React from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ModalTone } from "~/libs/components/modal/libs/enums/enums.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const DiscardConfirmation: React.FC<Properties> = ({
	isOpen,
	onCancel,
	onConfirm,
}: Properties) => (
	<Confirmation
		confirmLabel={GenerateLabel.DISCARD}
		confirmVariant={ButtonVariant.DANGER}
		isOpen={isOpen}
		onCancel={onCancel}
		onConfirm={onConfirm}
		title={GenerateMessage.DISCARD_TITLE}
		titleIconName={IconName.ALERT_CIRCLE}
		tone={ModalTone.DANGER}
	>
		<p className={styles["consequence"]}>
			{GenerateMessage.DISCARD_EDITS_LOST}
		</p>
	</Confirmation>
);

export { DiscardConfirmation };
