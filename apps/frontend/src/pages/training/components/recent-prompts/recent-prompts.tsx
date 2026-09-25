import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";

import { useGetPromptRecentQuery } from "~/modules/prompts/prompts-api.js";

import { RecentPromptsContent } from "./components/recent-prompts-content/recent-prompts-content.js";
import { RecentPromptsMessage } from "./libs/enums/enums.js";
import { getRecentPromptsState } from "./libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number | undefined;
};

const RecentPrompts: React.FC<Properties> = ({ workspaceId }: Properties) => {
	const { currentData: recent, isError } = useGetPromptRecentQuery(
		workspaceId === undefined ? skipToken : { workspaceId },
	);

	const state = getRecentPromptsState({
		isError,
		items: recent?.items,
		workspaceId,
	});

	return (
		<section className={styles["card"]}>
			<h2 className={styles["title"]}>{RecentPromptsMessage.TITLE}</h2>
			<RecentPromptsContent items={recent?.items ?? []} state={state} />
		</section>
	);
};

export { RecentPrompts };
