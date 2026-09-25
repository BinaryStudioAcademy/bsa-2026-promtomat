import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import { useGetComposedPromptByIdQuery } from "~/modules/composed-prompts/composed-prompts-api.js";
import {
	EvaluationMessage,
	useEvaluateMutation,
} from "~/modules/evaluations/evaluations.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import styles from "./styles.module.css";

const PromptDelivery: React.FC = () => {
	const navigate = useNavigate();
	const { composedPromptId, promptId } = useParams<{
		composedPromptId?: string;
		promptId?: string;
	}>();

	const isComposed = Boolean(composedPromptId);
	const targetId = Number(composedPromptId ?? promptId);

	const { data: regularData, isLoading: isLoadingRegular } =
		useGetPromptByIdQuery(targetId, {
			skip: isComposed || !targetId,
		});

	const { data: composedData, isLoading: isLoadingComposed } =
		useGetComposedPromptByIdQuery(targetId, {
			skip: !isComposed || !targetId,
		});

	const [evaluate] = useEvaluateMutation();

	const isLoading = isComposed ? isLoadingComposed : isLoadingRegular;
	const data = isComposed ? composedData : regularData;

	const handleScoreSelect = useCallback(
		(score: number): void => {
			const recordEvaluation = async (): Promise<void> => {
				try {
					await evaluate(
						isComposed
							? { composedPromptId: targetId, score }
							: { promptId: targetId, score },
					).unwrap();

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
		[evaluate, isComposed, navigate, targetId],
	);

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	const isRegularPrompt = "score" in data;

	return (
		<div className={getValidClasses("page-container", styles["page"])}>
			<PromptDeliveryView
				body={data.body}
				computedScore={data.computedScore}
				onScoreSelect={handleScoreSelect}
				{...(isRegularPrompt && {
					efficiencyScore: data.score,
					workspaceName: data.workspaceName,
				})}
			/>
		</div>
	);
};

export { PromptDelivery };
