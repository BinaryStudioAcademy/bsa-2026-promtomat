import React from "react";

import { ButtonLink } from "~/libs/components/button-link/button-link.js";
import { Button } from "~/libs/components/button/button.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { ScoreBadge } from "~/libs/components/score-badge/score-badge.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	type FallbackReason,
	type PromptCandidateDto,
} from "~/modules/composed-prompts/composed-prompts.js";
import { getPromptRoute, getScoreLabel } from "~/modules/prompts/prompts.js";

import {
	FallbackReasonMessage,
	GenerateLabel,
	GenerateMessage,
} from "../../libs/enums/enums.js";
import { ResultCard } from "../result-card/result-card.js";
import styles from "./styles.module.css";

type Properties = {
	onTryAgain: () => void;
	prompt: PromptCandidateDto;
	reason: ValueOf<typeof FallbackReason>;
};

const FallbackPromptCard: React.FC<Properties> = ({
	onTryAgain,
	prompt,
	reason,
}: Properties) => {
	const handleCopyPrompt = useCopyPrompt({ body: prompt.promptBody });
	const promptRoute = getPromptRoute(prompt.promptId);

	return (
		<ResultCard>
			<p className={styles["notice"]} role="status">
				{`${FallbackReasonMessage[reason]} ${GenerateMessage.FALLBACK_HINT}`}
			</p>
			<ResultCard.Kicker>{GenerateLabel.FALLBACK_KICKER}</ResultCard.Kicker>
			<div className={styles["candidate-header"]}>
				<h2 className={styles["heading"]}>{prompt.taskIntent}</h2>
				<ScoreBadge
					efficiencyScore={prompt.efficiencyScore}
					label={getScoreLabel(prompt.efficiencyScore)}
				/>
			</div>
			<PromptDeliveryView body={prompt.promptBody} isBodyHeaderHidden />
			<p className={styles["hint"]}>{GenerateMessage.FALLBACK_NOTHING_SAVED}</p>
			<ResultCard.Actions>
				<Button
					iconName={IconName.COPY}
					label={GenerateLabel.COPY_PROMPT}
					onClick={handleCopyPrompt}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
				<ButtonLink
					label={GenerateLabel.OPEN_IN_LOG}
					shouldOpenInNewTab
					to={promptRoute}
					variant={ButtonVariant.SECONDARY}
				/>
				<Button
					label={GenerateLabel.TRY_AGAIN}
					onClick={onTryAgain}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</ResultCard.Actions>
		</ResultCard>
	);
};

export { FallbackPromptCard };
