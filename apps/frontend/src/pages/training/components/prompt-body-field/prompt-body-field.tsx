import React, { useState } from "react";
import { type Control, useFormState, useWatch } from "react-hook-form";

import { SegmentedControl } from "~/libs/components/segmented-control/segmented-control.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

import { PromptBodyContent } from "./components/prompt-body-content/prompt-body-content.js";
import { PROMPT_BODY_MODE_OPTIONS } from "./libs/constants/constants.js";
import { PromptBodyFieldMessage, PromptBodyMode } from "./libs/enums/enums.js";
import { getPromptBodyState } from "./libs/helpers/helpers.js";
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
	const state = getPromptBodyState({ characterCount, mode });

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
			<PromptBodyContent
				control={control}
				isDisabled={isDisabled}
				promptBody={promptBody}
				state={state}
			/>
			{previewErrorMessage && (
				<p className={styles["error"]} role="alert">
					{previewErrorMessage}
				</p>
			)}
		</div>
	);
};

export { PromptBodyField };
