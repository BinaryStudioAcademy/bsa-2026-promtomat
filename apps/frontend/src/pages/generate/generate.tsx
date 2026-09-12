import React, { useCallback } from "react";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import {
	type ComposeRequestDto,
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

	return (
		<div className={styles["content-column"]}>
			<GenerateForm
				error={error}
				isLoading={isLoading}
				onSubmit={handleCompose}
			/>
			{isLoading && <Loader variant={LoaderVariant.SECTION} />}
			{data && <ComposeResult result={data} />}
		</div>
	);
};

export { Generate };
