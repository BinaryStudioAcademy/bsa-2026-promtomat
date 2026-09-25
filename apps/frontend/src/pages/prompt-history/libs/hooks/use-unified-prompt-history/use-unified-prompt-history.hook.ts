import { useMemo } from "react";

import { type ComposedPromptDto } from "~/modules/composed-prompts/libs/types/types.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import {
	checkMatchesQualityTier,
	checkMatchesSearch,
	mapComposedToHistoryItem,
	mapPromptToHistoryItem,
} from "../../helpers/helpers.js";
import { type PromptHistoryItem } from "../../types/types.js";

type Parameters = {
	composedItems: ComposedPromptDto[];
	qualityTier?: string | undefined;
	regularItems: PromptItemResponseDto[];
	search: string;
	workspaceName: string;
};

const useUnifiedPromptHistory = ({
	composedItems,
	qualityTier,
	regularItems,
	search,
	workspaceName,
}: Parameters): PromptHistoryItem[] => {
	return useMemo((): PromptHistoryItem[] => {
		const mappedRegular = regularItems.map((item) =>
			mapPromptToHistoryItem(item),
		);

		const filteredComposed = composedItems.filter(
			(item) =>
				checkMatchesQualityTier(item.computedScore, qualityTier) &&
				(checkMatchesSearch(item.description, search) ||
					checkMatchesSearch(item.body, search)),
		);

		const mappedComposed = filteredComposed.map((item) =>
			mapComposedToHistoryItem(item, workspaceName),
		);

		return [...mappedRegular, ...mappedComposed].toSorted(
			(first, second) =>
				new Date(second.createdAt).getTime() -
				new Date(first.createdAt).getTime(),
		);
	}, [composedItems, qualityTier, regularItems, search, workspaceName]);
};

export { useUnifiedPromptHistory };
