import React from "react";
import { type Control } from "react-hook-form";

import { Markdown } from "~/libs/components/markdown/markdown.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

import {
	PromptBodyFieldMessage,
	PromptBodyState,
} from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	control: Control<PromptCreateRequestDto, null>;
	isDisabled: boolean;
	promptBody: string;
	state: ValueOf<typeof PromptBodyState>;
};

const PromptBodyContent: React.FC<Properties> = ({
	control,
	isDisabled,
	promptBody,
	state,
}: Properties) => {
	if (state === PromptBodyState.WRITE) {
		return (
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
	}

	if (state === PromptBodyState.EMPTY_PREVIEW) {
		return (
			<div className={styles["preview"]}>
				<p className={styles["empty"]}>
					{PromptBodyFieldMessage.EMPTY_PREVIEW}
				</p>
			</div>
		);
	}

	return (
		<div className={styles["preview"]}>
			<Markdown content={promptBody} />
		</div>
	);
};

export { PromptBodyContent };
