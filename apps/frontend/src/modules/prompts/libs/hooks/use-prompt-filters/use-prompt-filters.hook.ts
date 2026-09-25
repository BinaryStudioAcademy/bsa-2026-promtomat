import { useCallback } from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	DEFAULT_PROMPT_FILTERS,
	SEARCH_DELAY_MS,
} from "~/modules/prompts/libs/constants/constants.js";
import {
	PaginationValue,
	PromptQualityTier,
} from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

type PromptFiltersFormValues = {
	qualityTier: ValueOf<typeof PromptQualityTier>;
	search: string;
	workspaceId: null | number;
};

type UsePromptFiltersReturn = {
	control: Control<PromptFiltersFormValues, null>;
	handleClearFilters: () => void;
	handleQualityTierChange: (
		tier: ValueOf<typeof PromptQualityTier>,
	) => () => void;
	queryPayload: Omit<PromptGetQueryDto, "page">;
	search: string;
	setValue: UseFormSetValue<PromptFiltersFormValues>;
};

const usePromptFilters = (): UsePromptFiltersReturn => {
	const { control, reset, setValue } = useAppForm<PromptFiltersFormValues>({
		defaultValues: DEFAULT_PROMPT_FILTERS,
	});

	const formValues = useWatch({ control });

	const currentSearch = formValues.search ?? "";
	const debouncedSearch = useDebounce(currentSearch, SEARCH_DELAY_MS);

	const queryPayload: Omit<PromptGetQueryDto, "page"> = {
		limit: PaginationValue.DEFAULT_LIMIT,
		qualityTier:
			formValues.qualityTier && formValues.qualityTier !== PromptQualityTier.ALL
				? formValues.qualityTier
				: undefined,
		search: debouncedSearch || undefined,
		workspaceId:
			typeof formValues.workspaceId === "number"
				? formValues.workspaceId
				: undefined,
	};

	const handleQualityTierChange = useCallback(
		(tier: ValueOf<typeof PromptQualityTier>) => {
			return (): void => {
				setValue("qualityTier", tier);
			};
		},
		[setValue],
	);

	const handleClearFilters = useCallback((): void => {
		reset({
			...DEFAULT_PROMPT_FILTERS,
			workspaceId: formValues.workspaceId ?? null,
		});
	}, [formValues.workspaceId, reset]);

	return {
		control,
		handleClearFilters,
		handleQualityTierChange,
		queryPayload,
		search: debouncedSearch,
		setValue,
	};
};

export { usePromptFilters };
