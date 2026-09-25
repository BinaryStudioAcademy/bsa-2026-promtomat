import React, { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { getRelativeTimeLabel } from "~/libs/helpers/helpers.js";
import { useCopyPrompt } from "~/libs/hooks/use-copy-prompt/use-copy-prompt.hook.js";
import { type ComposedPromptDto } from "~/modules/composed-prompts/composed-prompts.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces.js";

import { GenerateLabel, GenerateMessage } from "../../libs/enums/enums.js";
import { getProvenanceLabel } from "../../libs/helpers/helpers.js";
import { ResultCard } from "../result-card/result-card.js";
import styles from "./styles.module.css";

type Properties = {
	composedPrompt: ComposedPromptDto;
};

const ComposedResultCard: React.FC<Properties> = ({
	composedPrompt,
}: Properties) => {
	const { data: workspacesData } = useGetWorkspacesQuery({});
	const workspaceName = workspacesData?.items.find(
		({ id }) => id === composedPrompt.workspaceId,
	)?.name;

	const handleCopyPrompt = useCopyPrompt({ body: composedPrompt.body });

	const handleScoreSelect = useCallback(() => {
		return (): void => {};
	}, []);

	return (
		<ResultCard>
			<ResultCard.Kicker>{GenerateLabel.GENERATED_KICKER}</ResultCard.Kicker>
			<p className={styles["provenance"]}>
				<span>
					{getProvenanceLabel({
						sourceCount: composedPrompt.sources.length,
						workspaceName,
					})}
				</span>
				<span aria-hidden="true">·</span>
				<span>{getRelativeTimeLabel(composedPrompt.createdAt)}</span>
			</p>
			<PromptDeliveryView
				body={composedPrompt.body}
				explanation={composedPrompt.explanation.trim()}
				feedback={{
					hint: GenerateMessage.RATE_HINT,
					label: GenerateLabel.RATE_HEADING,
					onScoreSelect: handleScoreSelect,
				}}
				isBodyHeaderHidden
				sources={composedPrompt.sources}
			/>
			<ResultCard.Actions>
				<Button
					iconName={IconName.COPY}
					label={GenerateLabel.COPY_PROMPT}
					onClick={handleCopyPrompt}
					type="button"
					variant={ButtonVariant.PRIMARY}
				/>
			</ResultCard.Actions>
		</ResultCard>
	);
};

export { ComposedResultCard };
