import React from "react";
import { useParams } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDetailPanel } from "~/libs/components/prompt-detail-panel/prompt-detail-panel.js";
import { AppRoute, IconName } from "~/libs/enums/enums.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { PromptDeliveryLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const EMPTY_QUERY_PAYLOAD = {};

type ContentProperties = {
	prompt: PromptItemResponseDto;
};

const PromptDeliveryContent: React.FC<ContentProperties> = ({
	prompt,
}: ContentProperties) => (
	<div className={styles["page"]}>
		<Link
			className={styles["back-link"]}
			hasDefaultStyles={false}
			to={AppRoute.SMART_SEARCH}
		>
			<Icon
				className={styles["back-icon"]}
				iconName={IconName.CHEVRON}
			/>
			{PromptDeliveryLabel.BACK_TO_SEARCH}
		</Link>

		<p className={styles["eyebrow"]}>{PromptDeliveryLabel.EYEBROW}</p>

		<PromptDetailPanel
			isCompact={false}
			prompt={prompt}
			queryPayload={EMPTY_QUERY_PAYLOAD}
			showOpenFullPageLink={false}
		/>

		<Link
			className={styles["show-in-search"]}
			hasDefaultStyles={false}
			to={AppRoute.SMART_SEARCH}
		>
			{PromptDeliveryLabel.SHOW_IN_SEARCH}
		</Link>
	</div>
);

const PromptDelivery: React.FC = () => {
	const { promptId } = useParams<{ promptId?: string }>();
	const parsedPromptId = Number(promptId);
	const { data, isLoading } = useGetPromptByIdQuery(parsedPromptId);

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return <NotFoundPage />;
	}

	return <PromptDeliveryContent prompt={data} />;
};

export { PromptDelivery };
