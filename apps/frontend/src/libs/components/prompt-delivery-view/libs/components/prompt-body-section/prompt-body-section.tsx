import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import { PromptDeliveryCard } from "../prompt-delivery-card/prompt-delivery-card.js";
import styles from "./styles.module.css";

type Properties = {
	body: string;
	onCopyPrompt: () => void;
};

const PromptBodySection: React.FC<Properties> = ({
	body,
	onCopyPrompt,
}: Properties) => (
	<PromptDeliveryCard>
		<div className={styles["card-header"]}>
			<h2 className={styles["heading"]}>
				{PromptDeliveryViewLabel.OPTIMIZED_PROMPT_HEADING}
			</h2>
			<Button
				label={PromptDeliveryViewLabel.COPY_PROMPT}
				onClick={onCopyPrompt}
				size={ControlSize.SM}
				type="button"
				variant={ButtonVariant.PRIMARY}
			/>
		</div>
		<pre className={styles["body"]}>{body}</pre>
	</PromptDeliveryCard>
);

export { PromptBodySection };
