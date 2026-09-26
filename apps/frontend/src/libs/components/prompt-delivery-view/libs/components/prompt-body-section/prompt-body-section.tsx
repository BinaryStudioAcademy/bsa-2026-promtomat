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
	editor?: {
		control: Control<PromptUpdateBodyRequestDto, null>;
		isEditing: boolean;
		isSaving: boolean;
		onCancel: () => void;
		onSave: () => void;
		onStart: () => void;
	};
	onCopyPrompt: () => void;
};

const PromptBodySection: React.FC<Properties> = ({
	body,
	editor,
	onCopyPrompt,
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
			{editor && !editor.isEditing && (
				<Button
					iconName={IconName.EDIT}
					isDisabled={editor.isSaving}
					label={PromptDeliveryViewLabel.EDIT_PROMPT}
					onClick={editor.onStart}
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			)}
		</PromptDeliveryCard.Header>
		<PromptDeliveryCard.Body>
			{editor?.isEditing ? (
				<div className={styles["editor"]}>
					<Textarea
						control={editor.control}
						isDisabled={editor.isSaving}
						label={PromptDeliveryViewLabel.EDIT_PROMPT}
						name="promptBody"
						rows={8}
					/>
					<div className={styles["editor-actions"]}>
						<Button
							isDisabled={editor.isSaving}
							isLoading={editor.isSaving}
							label={PromptDeliveryViewLabel.SAVE_PROMPT}
							onClick={editor.onSave}
							type="button"
							variant={ButtonVariant.PRIMARY}
						/>
						<Button
							isDisabled={editor.isSaving}
							label={PromptDeliveryViewLabel.CANCEL}
							onClick={editor.onCancel}
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
