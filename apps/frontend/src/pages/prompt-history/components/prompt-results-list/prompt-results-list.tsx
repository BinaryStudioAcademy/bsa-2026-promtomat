import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

import { PromptHistoryLabel } from "../../libs/enums/prompt-history-label.enum.js";
import { type PromptHistoryItem } from "../../libs/types/types.js";
import { PromptDetailPanel } from "../prompt-detail-panel/prompt-detail-panel.js";
import { PromptResultCard } from "../prompt-result-card/prompt-result-card.js";
import styles from "./styles.module.css";

const ZERO_VALUE = 0;
const DETAIL_ID_PREFIX = "prompt-detail";

type Properties = {
	hasActiveFilters: boolean;
	hasWorkspace: boolean;
	isError: boolean;
	isFetching: boolean;
	isLoadingPrompts: boolean;
	isLoadingWorkspaces: boolean;
	items: PromptHistoryItem[];
	onRetry: () => void;
	onSelectPrompt: (uniqueKey: string) => void;
	queryPayload: Omit<PromptGetQueryDto, "page">;
	selectedPromptKey: null | string;
};

const PromptResultsList: React.FC<Properties> = ({
	hasActiveFilters,
	hasWorkspace,
	isError,
	isFetching,
	isLoadingPrompts,
	isLoadingWorkspaces,
	items,
	onRetry,
	onSelectPrompt,
	queryPayload,
	selectedPromptKey,
}: Properties) => {
	if (isLoadingWorkspaces || (hasWorkspace && isLoadingPrompts)) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (!hasWorkspace) {
		return (
			<div className={styles["empty-state"]}>
				{PromptHistoryLabel.EMPTY_NO_WORKSPACES}
			</div>
		);
	}

	if (isError && items.length === ZERO_VALUE) {
		return (
			<div className={styles["empty-state"]}>
				<p className={styles["empty-state-message"]}>
					{PromptHistoryLabel.LOAD_ERROR}
				</p>
				<Button
					label={PromptHistoryLabel.RETRY}
					onClick={onRetry}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</div>
		);
	}

	if (!isFetching && items.length === ZERO_VALUE) {
		return (
			<div className={styles["empty-state"]}>
				{hasActiveFilters
					? PromptHistoryLabel.EMPTY_FILTERS
					: PromptHistoryLabel.EMPTY_WORKSPACE}
			</div>
		);
	}

	return (
		<>
			{items.map((item) => {
				const isSelected = item.uniqueKey === selectedPromptKey;
				const detailId = `${DETAIL_ID_PREFIX}-${item.uniqueKey}`;

				return (
					<div className={styles["result-block"]} key={item.uniqueKey}>
						<PromptResultCard
							detailId={detailId}
							isSelected={isSelected}
							onSelect={onSelectPrompt}
							prompt={item}
						/>
						{isSelected ? (
							<div className={styles["mobile-detail"]} id={detailId}>
								<PromptDetailPanel prompt={item} queryPayload={queryPayload} />
							</div>
						) : null}
					</div>
				);
			})}
		</>
	);
};

export { PromptResultsList };
