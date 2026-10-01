import { useCallback, useState } from "react";

import { type PromptHistoryItem } from "../../types/types.js";

type PromptSelection = {
	filterKey: string;
	uniqueKey: null | string;
};

type Properties = {
	filterKey: string;
	items: PromptHistoryItem[];
};

type UsePromptSelectionReturn = {
	handleSelectPrompt: (uniqueKey: string) => void;
	selectedPrompt: null | PromptHistoryItem;
	selectedPromptKey: null | string;
};

const usePromptSelection = ({
	filterKey,
	items,
}: Properties): UsePromptSelectionReturn => {
	const [selection, setSelection] = useState<PromptSelection>({
		filterKey,
		uniqueKey: null,
	});

	const [firstItem] = items;
	const selectedKeyFromState =
		selection.filterKey === filterKey ? selection.uniqueKey : null;
	const hasSelectedInList =
		selectedKeyFromState !== null &&
		items.some((item) => item.uniqueKey === selectedKeyFromState);
	const selectedPromptKey = hasSelectedInList
		? selectedKeyFromState
		: (firstItem?.uniqueKey ?? null);
	const selectedPrompt =
		items.find((item) => item.uniqueKey === selectedPromptKey) ?? null;

	const handleSelectPrompt = useCallback(
		(uniqueKey: string): void => {
			setSelection({ filterKey, uniqueKey });
		},
		[filterKey],
	);

	return { handleSelectPrompt, selectedPrompt, selectedPromptKey };
};

export { usePromptSelection };
