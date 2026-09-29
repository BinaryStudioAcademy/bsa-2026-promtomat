import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PromptDetailPanel } from "~/libs/components/prompt-detail-panel/prompt-detail-panel.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import {
	type PromptGetQueryDto,
	type PromptItemResponseDto,
} from "~/modules/prompts/libs/types/types.js";

import { PromptHistoryLabel } from "../../libs/enums/enum.js";
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
	items: PromptItemResponseDto[];
	onRetry: () => void;
	onSelectPrompt: (promptId: number) => void;
	queryPayload: Omit<PromptGetQueryDto, "page">;
	selectedPromptId: null | number;
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
	selectedPromptId,
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
				const isSelected = item.id === selectedPromptId;
				const detailId = `${DETAIL_ID_PREFIX}-${String(item.id)}`;

				return (
					<div className={styles["result-block"]} key={item.id}>
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
