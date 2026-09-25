import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	onRetry: () => void;
};

const GenerationFailedNotice: React.FC<Properties> = ({
	onRetry,
}: Properties) => (
	<div className={styles["notice"]} role="alert">
		<span>{GenerateMessage.GENERATION_FAILED}</span>
		<Button
			label={GenerateLabel.RETRY}
			onClick={onRetry}
			size={ControlSize.SM}
			type="button"
			variant={ButtonVariant.SECONDARY}
		/>
	</div>
);

export { GenerationFailedNotice };
