import React from "react";
import { type Control } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { type PromptUpdateBodyRequestDto } from "~/modules/prompts/libs/types/types.js";

import { PromptDeliveryViewLabel } from "../../enums/enums.js";
import { PromptDeliveryCard } from "../prompt-delivery-card/prompt-delivery-card.js";
import styles from "./styles.module.css";

type Properties = {
	body: string;
	bodyControl?: Control<PromptUpdateBodyRequestDto, null>;
	isEditingBody?: boolean;
	isSavingBody?: boolean;
	onCancelBodyEdit?: () => void;
	onCopyPrompt: () => void;
	onSaveBody?: () => void;
	onStartBodyEdit?: () => void;
};

const PromptBodySection: React.FC<Properties> = ({
	body,
	bodyControl,
	isEditingBody = false,
	isSavingBody = false,
	onCancelBodyEdit,
	onCopyPrompt,
	onSaveBody,
	onStartBodyEdit,
}: Properties) => (
	<PromptDeliveryCard>
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
			{onStartBodyEdit && !isEditingBody && (
				<Button
					iconName={IconName.EDIT}
					isDisabled={isSavingBody}
					label={PromptDeliveryViewLabel.EDIT_PROMPT}
					onClick={onStartBodyEdit}
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			)}
		</PromptDeliveryCard.Header>
		<PromptDeliveryCard.Body>
			{isEditingBody && bodyControl && onSaveBody && onCancelBodyEdit ? (
				<div className={styles["editor"]}>
					<Textarea
						control={bodyControl}
						isDisabled={isSavingBody}
						label={PromptDeliveryViewLabel.EDIT_PROMPT}
						name="promptBody"
						rows={8}
					/>
					<div className={styles["editor-actions"]}>
						<Button
							isDisabled={isSavingBody}
							isLoading={isSavingBody}
							label={PromptDeliveryViewLabel.SAVE_PROMPT}
							onClick={onSaveBody}
							type="button"
							variant={ButtonVariant.PRIMARY}
						/>
						<Button
							isDisabled={isSavingBody}
							label={PromptDeliveryViewLabel.CANCEL}
							onClick={onCancelBodyEdit}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</div>
				</div>
			) : (
				<pre className={styles["prompt-body"]}>{body}</pre>
			)}
		</PromptDeliveryCard.Body>
	</PromptDeliveryCard>
);

export { PromptBodySection };
