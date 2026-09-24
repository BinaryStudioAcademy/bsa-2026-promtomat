import { useCallback } from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import {
	DEFAULT_PROMPT_FILTERS_VALUES,
	SEARCH_DELAY_MS,
} from "~/modules/prompts/libs/constants/constants.js";
import { PaginationValue } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

type PromptFiltersFormValues = {
	score: number | string;
	search: string;
	workspaceId: null | number;
};

type UsePromptFiltersReturn = {
	control: Control<PromptFiltersFormValues, null>;
	handleClearFilters: () => void;
	queryPayload: Omit<PromptGetQueryDto, "page">;
	search: string;
	setValue: UseFormSetValue<PromptFiltersFormValues>;
};

const usePromptFilters = (): UsePromptFiltersReturn => {
	const { control, reset, setValue } = useAppForm<PromptFiltersFormValues>({
		defaultValues: DEFAULT_PROMPT_FILTERS_VALUES,
	});

	const formValues = useWatch({ control });

	const currentSearch = formValues.search ?? "";
	const debouncedSearch = useDebounce(currentSearch, SEARCH_DELAY_MS);

	const queryPayload: Omit<PromptGetQueryDto, "page"> = {
		limit: PaginationValue.DEFAULT_LIMIT,
		score: typeof formValues.score === "number" ? formValues.score : undefined,
		search: debouncedSearch || undefined,
		workspaceId:
			typeof formValues.workspaceId === "number"
				? formValues.workspaceId
				: undefined,
	};

	const handleClearFilters = useCallback((): void => {
		reset({
			...DEFAULT_PROMPT_FILTERS_VALUES,
			workspaceId: formValues.workspaceId ?? null,
		});
	}, [formValues.workspaceId, reset]);

	return {
		control,
		handleClearFilters,
		queryPayload,
		search: debouncedSearch,
		setValue,
	};
};

export { usePromptFilters };
