import React, { useCallback } from "react";
import { useParams } from "react-router-dom";

import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDeliveryView } from "~/libs/components/prompt-delivery-view/prompt-delivery-view.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { PromptDeliveryLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const PromptDelivery: React.FC = () => {
	const { promptId } = useParams<{ promptId?: string }>();
	const parsedPromptId = Number(promptId);

	const { data, isLoading } = useGetPromptByIdQuery(parsedPromptId);

	const handleScoreSelect = useCallback(() => {
		return (): void => {};
	}, []);

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	return (
		<div className={getValidClasses("page-container", styles["page"])}>
			<PromptDeliveryView
				body={data.body}
				efficiencyScore={data.score}
				feedback={{
					label: PromptDeliveryLabel.FEEDBACK_HEADING,
					onScoreSelect: handleScoreSelect,
				}}
				workspaceName={data.workspaceName}
			/>
		</div>
	);
};

export { PromptDelivery };
