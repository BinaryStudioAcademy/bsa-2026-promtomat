import React, { useState } from "react";
import { type Control, useFormState, useWatch } from "react-hook-form";

import { Markdown } from "~/libs/components/markdown/markdown.js";
import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

import { PROMPT_BODY_MODE_OPTIONS } from "./libs/constants/constants.js";
import { PromptBodyFieldMessage, PromptBodyMode } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	control: Control<PromptCreateRequestDto, null>;
	isDisabled: boolean;
};

const PromptBodyField: React.FC<Properties> = ({
	control,
	isDisabled,
}: Properties) => {
	const [mode, setMode] = useState<ValueOf<typeof PromptBodyMode>>(
		PromptBodyMode.WRITE,
	);

	const promptBody = useWatch({ control, name: "promptBody" });
	const { errors } = useFormState({ control, name: "promptBody" });
	const characterCount = promptBody.length;
	const previewErrorMessage =
		mode === PromptBodyMode.PREVIEW ? errors.promptBody?.message : undefined;

	let content: React.ReactNode;

	if (mode === PromptBodyMode.WRITE) {
		content = (
			<Textarea
				autoComplete="off"
				className={styles["textarea"]}
				control={control}
				isDisabled={isDisabled}
				isLabelHidden={true}
				label={PromptBodyFieldMessage.LABEL}
				name="promptBody"
				placeholder={PromptBodyFieldMessage.PLACEHOLDER}
			/>
		);
	} else if (characterCount === EMPTY_LENGTH) {
		content = (
			<div className={styles["preview"]}>
				<p className={styles["empty"]}>
					{PromptBodyFieldMessage.EMPTY_PREVIEW}
				</p>
			</div>
		);
	} else {
		content = (
			<div className={styles["preview"]}>
				<Markdown content={promptBody} />
			</div>
		);
	}

	return (
		<div className={styles["field"]}>
			<div className={styles["toolbar"]}>
				<span className={styles["label"]}>{PromptBodyFieldMessage.LABEL}</span>
				<span className={styles["hint"]}>
					{PromptBodyFieldMessage.MARKDOWN_HINT}
				</span>
				<div className={styles["mode"]}>
					<SegmentedControl
						label={PromptBodyFieldMessage.MODE_LABEL}
						onChange={setMode}
						options={PROMPT_BODY_MODE_OPTIONS}
						value={mode}
					/>
				</div>
				<span className={styles["count"]}>
					{characterCount} {PromptBodyFieldMessage.CHARS}
				</span>
			</div>
			{content}
			{previewErrorMessage && (
				<p className={styles["error"]} role="alert">
					{previewErrorMessage}
				</p>
			)}
		</div>
	);
};

export { PromptBodyField };
