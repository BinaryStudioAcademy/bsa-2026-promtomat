import React, { useCallback } from "react";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import {
	AppRoute,
	EvaluationTargetType,
	IconName,
} from "~/libs/enums/enums.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { type ComposedPromptDto } from "~/modules/composed-prompts/composed-prompts.js";
import {
	EvaluationMessage,
	useEvaluateMutation,
} from "~/modules/evaluations/evaluations.js";

import { PromptDeliveryLabel } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	composedPrompt: ComposedPromptDto;
};

const ComposedPromptDeliveryContent: React.FC<Properties> = ({
	composedPrompt,
}: Properties) => {
	const [evaluate, { isLoading: isEvaluating }] = useEvaluateMutation();

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				void evaluate({
					score,
					targetId: composedPrompt.id,
					targetType: EvaluationTargetType.COMPOSED_PROMPT,
				})
					.unwrap()
					.then(() => {
						showNotification({
							message: EvaluationMessage.EVALUATION_SUCCESS,
							type: NotificationType.SUCCESS,
						});
					})
					.catch(() => {
						showNotification({
							message: EvaluationMessage.EVALUATION_FAILED,
							type: NotificationType.DANGER,
						});
					});
			};
		},
		[composedPrompt.id, evaluate],
	);

	return (
		<PageContainer>
			<div className={styles["page"]}>
				<Link
					className={styles["back-link"]}
					hasDefaultStyles={false}
					to={AppRoute.SMART_SEARCH}
				>
					<Icon className={styles["back-icon"]} iconName={IconName.CHEVRON} />
					{PromptDeliveryLabel.BACK_TO_SEARCH}
				</Link>

				<p className={styles["eyebrow"]}>{PromptDeliveryLabel.EYEBROW}</p>

				<PromptDeliveryView
					body={composedPrompt.body}
					computedScore={composedPrompt.computedScore}
					explanation={composedPrompt.explanation}
					feedback={{
						isDisabled: isEvaluating,
						label: PromptDeliveryLabel.YOUR_RATING,
						onScoreSelect: handleScoreSelect,
						selectedScore: composedPrompt.myScore ?? null,
					}}
					sources={composedPrompt.sources}
				/>

				<Link
					className={styles["show-in-search"]}
					hasDefaultStyles={false}
					to={AppRoute.SMART_SEARCH}
				>
					{PromptDeliveryLabel.SHOW_IN_SEARCH}
				</Link>
			</div>
		</PageContainer>
	);
};

export { ComposedPromptDeliveryContent };
