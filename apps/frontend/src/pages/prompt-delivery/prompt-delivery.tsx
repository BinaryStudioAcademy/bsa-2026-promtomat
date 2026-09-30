import React from "react";
import { useParams } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PromptDetailPanel } from "~/libs/components/prompt-detail-panel/prompt-detail-panel.js";
import { AppRoute, IconName } from "~/libs/enums/enums.js";
import { useGetComposedPromptByIdQuery } from "~/modules/composed-prompts/composed-prompts-api.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";
import { useGetPromptByIdQuery } from "~/modules/prompts/prompts-api.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { ComposedPromptDeliveryContent } from "./components/composed-prompt-delivery-content/composed-prompt-delivery-content.js";
import { PromptDeliveryLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type ContentProperties = {
	prompt: PromptItemResponseDto;
};

const PromptDeliveryContent: React.FC<ContentProperties> = ({
	prompt,
}: ContentProperties) => (
	<PageContainer>
		<div className={styles["page"]}>
			<Link
				className={styles["back-link"]}
				hasDefaultStyles={false}
				to={AppRoute.SMART_SEARCH}
			>
				<Icon className={styles["back-icon"]} iconName={IconName.CHEVRON} />
				{PromptDeliveryLabel.BACK_TO_SEARCH}
			</Link>

			<p className={styles["eyebrow"]}>{PromptDeliveryLabel.EYEBROW}</p>

			<PromptDetailPanel
				isCompact={false}
				prompt={prompt}
				shouldShowOpenFullPageLink={false}
			/>

			<Link
				className={styles["show-in-search"]}
				hasDefaultStyles={false}
				to={AppRoute.SMART_SEARCH}
			>
				{PromptDeliveryLabel.SHOW_IN_SEARCH}
			</Link>
		</div>
	</PageContainer>
);

const PromptDelivery: React.FC = () => {
	const { composedPromptId, promptId } = useParams<{
		composedPromptId?: string;
		promptId?: string;
	}>();

	const isComposed = Boolean(composedPromptId);
	const targetId = Number(composedPromptId ?? promptId);

	const { data: regularData, isLoading: isLoadingRegular } =
		useGetPromptByIdQuery(targetId, {
			skip: isComposed || !targetId,
		});

	const { data: composedData, isLoading: isLoadingComposed } =
		useGetComposedPromptByIdQuery(targetId, {
			skip: !isComposed || !targetId,
		});

	if (isComposed) {
		if (isLoadingComposed) {
			return <Loader variant={LoaderVariant.SECTION} />;
		}

		if (!composedData) {
			return <NotFoundPage />;
		}

		return <ComposedPromptDeliveryContent composedPrompt={composedData} />;
	}

	if (isLoadingRegular) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!regularData) {
		return <NotFoundPage />;
	}

	return <PromptDeliveryContent prompt={regularData} />;
};

export { PromptDelivery };
