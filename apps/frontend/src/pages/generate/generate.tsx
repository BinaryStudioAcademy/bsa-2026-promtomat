import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import {
	type ComposeRequestDto,
	ComposeResultKind,
	useComposeMutation,
} from "~/modules/composed-prompts/composed-prompts.js";
import { useEvaluateMutation } from "~/modules/evaluations/evaluations.js";

import { ComposeResult } from "./components/compose-result/compose-result.js";
import { GenerateForm } from "./components/generate-form/generate-form.js";
import styles from "./styles.module.css";

const Generate: React.FC = () => {
	const navigate = useNavigate();
	const [compose, { data, error, isLoading }] = useComposeMutation();
	const [evaluate] = useEvaluateMutation();

	const handleCompose = useCallback(
		(payload: ComposeRequestDto): void => {
			void compose(payload);
		},
		[compose],
	);

	const composedPrompt =
		data?.kind === ComposeResultKind.COMPOSED ? data.composedPrompt : null;
	const shouldShowFallbackResult =
		data !== undefined && data.kind !== ComposeResultKind.COMPOSED;

	const handleScoreSelect = useCallback(
		(score: number): void => {
			const recordEvaluation = async (): Promise<void> => {
				if (!composedPrompt?.id) {
					return;
				}

				try {
					await evaluate({
						composedPromptId: composedPrompt.id,
						score,
					}).unwrap();

					showNotification({
						message: "Weights re-calculated successfully!",
						type: "success",
					});

					void navigate(AppRoute.ROOT);
				} catch {
					showNotification({
						message: "Failed to record evaluation. Please try again.",
						type: "danger",
					});
				}
			};

			void recordEvaluation();
		},
		[composedPrompt, evaluate, navigate],
	);

	return (
		<div className={styles["content-column"]}>
			<GenerateForm
				error={error}
				isLoading={isLoading}
				onSubmit={handleCompose}
			/>
			{isLoading && <Loader variant={LoaderVariant.SECTION} />}
			{!isLoading && composedPrompt && (
				<PromptDeliveryView
					body={composedPrompt.body}
					computedScore={composedPrompt.computedScore}
					explanation={composedPrompt.explanation.trim()}
					onScoreSelect={handleScoreSelect}
					sources={composedPrompt.sources}
				/>
			)}
			{!isLoading && shouldShowFallbackResult && (
				<ComposeResult result={data} />
			)}
		</div>
	);
};

export { Generate };
