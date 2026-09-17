import React from "react";
import { useParams } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import styles from "./styles.module.css";

const PromptDelivery: React.FC = () => {
	const { promptId } = useParams<{ promptId?: string }>();
	const parsedPromptId = Number(promptId);

	const { data, isLoading } = useGetPromptByIdQuery(parsedPromptId);
	const { data: workspacesData } = useGetWorkspacesQuery({});

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	const workspaceName = workspacesData?.items.find(
		(workspace) => workspace.id === data.workspaceId,
	)?.name;

	return (
		<div className={getValidClasses("page-container", styles["page"])}>
			<PromptDeliveryView
				body={data.promptBody}
				efficiencyScore={data.efficiencyScore}
				{...(workspaceName === undefined ? {} : { workspaceName })}
			/>
		</div>
	);
};

export { PromptDelivery };
