import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import { PromptDeliveryCard } from "../prompt-delivery-card/prompt-delivery-card.js";
import styles from "./styles.module.css";

type Properties = {
	body: string;
	bodySlot: React.ReactNode;
	isHeaderHidden: boolean;
	onCopyPrompt: () => void;
};

const PromptBodySection: React.FC<Properties> = ({
	body,
	bodySlot,
	isHeaderHidden,
	onCopyPrompt,
}: Properties) => (
	<PromptDeliveryCard>
		{!isHeaderHidden && (
			<PromptDeliveryCard.Header>
				<PromptDeliveryCard.Title>
					{PromptDeliveryViewLabel.OPTIMIZED_PROMPT_HEADING}
				</PromptDeliveryCard.Title>
				<Button
					label={PromptDeliveryViewLabel.COPY_PROMPT}
					onClick={onCopyPrompt}
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
			</PromptDeliveryCard.Header>
		)}
		<PromptDeliveryCard.Body>
			{bodySlot ?? <pre className={styles["prompt-body"]}>{body}</pre>}
		</PromptDeliveryCard.Body>
	</PromptDeliveryCard>
);

export { PromptBodySection };
