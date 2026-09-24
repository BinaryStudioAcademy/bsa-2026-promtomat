import { useCallback, useState } from "react";

import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

type PromptSelection = {
	filterKey: string;
	promptId: null | number;
};

type Properties = {
	filterKey: string;
	items: PromptItemResponseDto[];
};

type UsePromptSelectionReturn = {
	handleSelectPrompt: (promptId: number) => void;
	selectedPrompt: null | PromptItemResponseDto;
	selectedPromptId: null | number;
};

const usePromptSelection = ({
	filterKey,
	items,
}: Properties): UsePromptSelectionReturn => {
	const [selection, setSelection] = useState<PromptSelection>({
		filterKey,
		promptId: null,
	});

	const [firstItem] = items;
	const selectedPromptIdFromState =
		selection.filterKey === filterKey ? selection.promptId : null;
	const hasSelectedInList =
		selectedPromptIdFromState !== null &&
		items.some((item) => item.id === selectedPromptIdFromState);
	const selectedPromptId = hasSelectedInList
		? selectedPromptIdFromState
		: (firstItem?.id ?? null);
	const selectedPrompt =
		items.find((item) => item.id === selectedPromptId) ?? null;

	const handleSelectPrompt = useCallback(
		(promptId: number): void => {
			setSelection({ filterKey, promptId });
		},
		[filterKey],
	);

	return { handleSelectPrompt, selectedPrompt, selectedPromptId };
};

export { usePromptSelection };
