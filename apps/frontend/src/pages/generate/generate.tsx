import React, { useCallback } from "react";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import {
	type ComposeRequestDto,
	ComposeResultKind,
	useComposeMutation,
} from "~/modules/composed-prompts/composed-prompts.js";

import { ComposeResult } from "./components/compose-result/compose-result.js";
import { GenerateForm } from "./components/generate-form/generate-form.js";
import styles from "./styles.module.css";

const Generate: React.FC = () => {
	const [compose, { data, error, isLoading }] = useComposeMutation();

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
					explanation={composedPrompt.explanation.trim()}
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
