import { useCallback } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import { usePagination } from "~/libs/hooks/use-pagination/use-pagination.hook.js";
import {
	DEFAULT_PROMPT_FILTERS_VALUES,
	SEARCH_DELAY_MS,
} from "~/modules/prompts/libs/constants/constants.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

import { usePromptQueryPayload } from "./use-prompt-query-payload.hook.js";

type PromptFiltersFormValues = {
	score: number | string;
	search: string;
	workspaceId: null | number;
};

type UsePromptFiltersReturn = {
	control: Control<PromptFiltersFormValues, null>;
	handlePageChange: () => void;
	handleScoreChange: (score: number | string) => () => void;
	queryPayload: PromptGetQueryDto;
};

const usePromptFilters = (): UsePromptFiltersReturn => {
	const { handlePageChange, page, resetPage } = usePagination();

	const { control, setValue } = useAppForm<PromptFiltersFormValues>({
		defaultValues: DEFAULT_PROMPT_FILTERS_VALUES,
	});

	const formValues = useWatch({ control });

	const currentSearch = formValues.search ?? "";
	const currentScore = formValues.score ?? "";
	const currentWorkspaceId = formValues.workspaceId ?? null;

	const debouncedSearch = useDebounce(currentSearch, SEARCH_DELAY_MS);

	const queryPayload = usePromptQueryPayload({
		debouncedSearch,
		page,
		resetPage,
		score: currentScore,
		workspaceId: currentWorkspaceId,
	});

	const handleScoreChange = useCallback(
		(score: number | string) => {
			return (): void => {
				setValue("score", formValues.score === score ? "" : score);
			};
		},
		[formValues.score, setValue],
	);

	return {
		control,
		handlePageChange,
		handleScoreChange,
		queryPayload,
	};
};

export { usePromptFilters };
