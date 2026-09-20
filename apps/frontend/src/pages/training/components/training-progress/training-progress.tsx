import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { useGetPromptProgressQuery } from "~/modules/prompts/prompts-api.js";

import { TrainingProgressMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number | undefined;
};

const TrainingProgress: React.FC<Properties> = ({
	workspaceId,
}: Properties) => {
	const { currentData: progress, isError } = useGetPromptProgressQuery(
		workspaceId === undefined ? skipToken : { workspaceId },
	);

	let content: React.ReactNode;

	if (workspaceId === undefined) {
		content = (
			<p className={styles["message"]}>
				{TrainingProgressMessage.NO_WORKSPACE}
			</p>
		);
	} else if (isError) {
		content = (
			<p className={styles["message"]}>{TrainingProgressMessage.ERROR}</p>
		);
	} else if (progress) {
		content = (
			<ProgressBar
				count={progress.count}
				label={TrainingProgressMessage.PROGRESS_LABEL}
				target={progress.target}
				unit={TrainingProgressMessage.PROGRESS_UNIT}
			/>
		);
	} else {
		content = (
			<Loader
				label={TrainingProgressMessage.LOADING}
				variant={LoaderVariant.SECTION}
			/>
		);
	}

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{TrainingProgressMessage.TITLE}</h2>
			{content}
		</section>
	);
};

export { TrainingProgress };
