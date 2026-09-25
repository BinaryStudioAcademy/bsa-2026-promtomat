import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import {
	EvaluationMessage,
	useEvaluateMutation,
} from "~/modules/evaluations/evaluations.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import styles from "./styles.module.css";

const PromptDelivery: React.FC = () => {
	const navigate = useNavigate();
	const { promptId } = useParams<{ promptId?: string }>();
	const parsedPromptId = Number(promptId);

	const { data, isLoading } = useGetPromptByIdQuery(parsedPromptId);
	const [evaluate] = useEvaluateMutation();

	const handleScoreSelect = useCallback(
		(score: number): void => {
			const recordEvaluation = async (): Promise<void> => {
				try {
					await evaluate({
						promptId: parsedPromptId,
						score,
					}).unwrap();

					showNotification({
						message: EvaluationMessage.EVALUATION_SUCCESS,
						type: "success",
					});

					void navigate(AppRoute.ROOT);
				} catch {
					showNotification({
						message: EvaluationMessage.EVALUATION_FAILED,
						type: "danger",
					});
				}
			};

			void recordEvaluation();
		},
		[evaluate, navigate, parsedPromptId],
	);

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	return (
		<div className={getValidClasses("page-container", styles["page"])}>
			<PromptDeliveryView
				body={data.body}
				computedScore={data.computedScore}
				efficiencyScore={data.score}
				onScoreSelect={handleScoreSelect}
				workspaceName={data.workspaceName}
			/>
		</div>
	);
};

export { PromptDelivery };
