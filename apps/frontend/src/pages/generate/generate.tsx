import React from "react";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";

import { ComposeResult } from "./components/compose-result/compose-result.js";
import { GenerateForm } from "./components/generate-form/generate-form.js";
import { GenerationFailedNotice } from "./components/generation-failed-notice/generation-failed-notice.js";
import { GenerateLabel } from "./libs/enums/enums.js";
import { useGenerateForm } from "./libs/hooks/use-generate-form/use-generate-form.hook.js";
import styles from "./styles.module.css";

const Generate: React.FC = () => {
	const {
		control,
		handleDiscard,
		handleRecompose,
		handleRetry,
		handleSubmit,
		hasFailure,
		hasWorkspace,
		isLoading,
		result,
		workspaces,
	} = useGenerateForm();

	return (
		<div className={styles["container"]}>
			<div className={styles["page-wrapper"]}>
				<PageIntro
					description={GenerateLabel.PAGE_DESCRIPTION}
					label={GenerateLabel.PAGE_LABEL}
					title={GenerateLabel.PAGE_TITLE}
				/>
				<GenerateForm
					control={control}
					hasWorkspace={hasWorkspace}
					isLoading={isLoading}
					onSubmit={handleSubmit}
					workspaces={workspaces}
				/>
				{isLoading && <Loader variant={LoaderVariant.SECTION} />}
				{!isLoading && hasFailure && (
					<GenerationFailedNotice onRetry={handleRetry} />
				)}
				{!isLoading && result && (
					<ComposeResult
						onDiscard={handleDiscard}
						onRecompose={handleRecompose}
						onTryAgain={handleRetry}
						result={result}
					/>
				)}
			</div>
		</div>
	);
};

export { Generate };
