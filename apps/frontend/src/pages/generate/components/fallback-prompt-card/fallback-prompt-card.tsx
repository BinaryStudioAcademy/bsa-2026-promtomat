import React from "react";

import { type ValueOf } from "~/libs/types/types.js";
import {
	type FallbackReason,
	type PromptCandidateDto,
} from "~/modules/composed-prompts/composed-prompts.js";
import { PromptValidationRule } from "~/modules/prompts/prompts.js";

import {
	FallbackReasonMessage,
	GenerateLabel,
	GenerateMessage,
} from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	prompt: PromptCandidateDto;
	reason: ValueOf<typeof FallbackReason>;
};

const FallbackPromptCard: React.FC<Properties> = ({
	prompt,
	reason,
}: Properties) => (
	<article className={styles["card"]}>
		<p className={styles["notice"]} role="status">
			{`${FallbackReasonMessage[reason]} ${GenerateMessage.FALLBACK_HINT}`}
		</p>
		<span className={styles["kicker"]}>{GenerateLabel.FALLBACK_KICKER}</span>
		<div className={styles["candidate-header"]}>
			<h2 className={styles["heading"]}>{prompt.taskIntent}</h2>
			<span className={styles["score"]}>
				{`${GenerateLabel.SCORE} ${String(prompt.efficiencyScore)} / ${String(PromptValidationRule.EFFICIENCY_SCORE_MAX)}`}
			</span>
		</div>
		<pre className={styles["body"]}>{prompt.promptBody}</pre>
	</article>
);

export { FallbackPromptCard };
