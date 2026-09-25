import React, { useCallback, useRef } from "react";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { isValidationError } from "~/libs/modules/api/libs/helpers/is-validation-error.helper.js";
import {
	type ComposeRequestDto,
	useComposeMutation,
} from "~/modules/composed-prompts/composed-prompts.js";

import { ComposeResult } from "./components/compose-result/compose-result.js";
import { GenerateForm } from "./components/generate-form/generate-form.js";
import { GenerationFailedNotice } from "./components/generation-failed-notice/generation-failed-notice.js";
import { GenerateLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const Generate: React.FC = () => {
	const [compose, { data, error, isLoading }] = useComposeMutation();
	const lastPayloadReference = useRef<ComposeRequestDto | null>(null);

	const handleCompose = useCallback(
		(payload: ComposeRequestDto): void => {
			lastPayloadReference.current = payload;
			void compose(payload);
		},
		[compose],
	);

	const handleRetry = useCallback((): void => {
		if (lastPayloadReference.current) {
			void compose(lastPayloadReference.current);
		}
	}, [compose]);

	const hasFailure = error !== undefined && !isValidationError(error);

	return (
		<div className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<PageIntro
					description={GenerateLabel.PAGE_DESCRIPTION}
					label={GenerateLabel.PAGE_LABEL}
					title={GenerateLabel.PAGE_TITLE}
				/>
				<GenerateForm
					error={error}
					isLoading={isLoading}
					onSubmit={handleCompose}
				/>
				{isLoading && <Loader variant={LoaderVariant.SECTION} />}
				{!isLoading && hasFailure && (
					<GenerationFailedNotice onRetry={handleRetry} />
				)}
				{!isLoading && data && (
					<ComposeResult onTryAgain={handleRetry} result={data} />
				)}
			</div>
		</div>
	);
};

export { Generate };
