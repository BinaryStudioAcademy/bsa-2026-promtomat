import { PaginationValue } from "@promptomat/shared";
import { useCallback, useEffect, useState } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import {
	DEFAULT_PROMPT_FILTERS_VALUES,
	PAGE_INCREMENT,
	SEARCH_DELAY_MS,
} from "~/modules/prompts/libs/constants/constants.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

type PromptFiltersFormValues = {
	score: number | string;
	search: string;
	workspaceId: number | string;
};

type UsePromptFiltersReturn = {
	control: Control<PromptFiltersFormValues, null>;
	handlePageChange: () => void;
	handleScoreChange: (score: number | string) => () => void;
	queryPayload: PromptGetQueryDto;
};

const usePromptFilters = (): UsePromptFiltersReturn => {
	const [page, setPage] = useState<number>(PaginationValue.DEFAULT_PAGE);

	const { control, setValue } = useAppForm<PromptFiltersFormValues>({
		defaultValues: DEFAULT_PROMPT_FILTERS_VALUES,
	});

	const formValues = useWatch({ control });

	const debouncedSearch = useDebounce(formValues.search ?? "", SEARCH_DELAY_MS);

	useEffect(() => {
		setPage(PaginationValue.DEFAULT_PAGE);
	}, [debouncedSearch, formValues.score, formValues.workspaceId]);

	const handlePageChange = useCallback((): void => {
		setPage((previous) => previous + PAGE_INCREMENT);
	}, []);

	const handleScoreChange = useCallback(
		(score: number | string) => {
			return (): void => {
				setValue("score", formValues.score === score ? "" : score);
			};
		},
		[formValues.score, setValue],
	);

	const queryPayload: PromptGetQueryDto = {
		limit: PaginationValue.DEFAULT_LIMIT,
		page,
		score: typeof formValues.score === "number" ? formValues.score : undefined,
		search: debouncedSearch || undefined,
		workspaceId:
			typeof formValues.workspaceId === "number"
				? formValues.workspaceId
				: undefined,
	};

	return {
		control,
		handlePageChange,
		handleScoreChange,
		queryPayload,
	};
};

export { usePromptFilters };
