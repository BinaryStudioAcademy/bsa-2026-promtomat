import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";

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
	const { data: progress } = useGetPromptProgressQuery(
		workspaceId === undefined ? skipToken : { workspaceId },
	);

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{TrainingProgressMessage.TITLE}</h2>
			{progress ? (
				<ProgressBar
					count={progress.count}
					label={TrainingProgressMessage.PROGRESS_LABEL}
					target={progress.target}
					unit={TrainingProgressMessage.PROGRESS_UNIT}
				/>
			) : (
				<p className={styles["message"]}>
					{TrainingProgressMessage.NO_WORKSPACE}
				</p>
			)}
		</section>
	);
};

export { TrainingProgress };
