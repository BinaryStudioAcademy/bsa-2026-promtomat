import { useCallback, useEffect, useState } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
	PAGE_INCREMENT,
	SEARCH_DELAY_MS,
} from "~/modules/prompts/libs/constants/constants.js";
import { PromptScope } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

type PromptFiltersFormValues = {
	scope: ValueOf<typeof PromptScope>;
	score: number | string;
	search: string;
	workspaceId: number | string;
};

type UsePromptFiltersReturn = {
	control: Control<PromptFiltersFormValues, null>;
	handlePageChange: () => void;
	handleScopeChange: (scope: ValueOf<typeof PromptScope>) => void;
	handleScoreChange: (score: number | string) => () => void;
	queryPayload: PromptGetQueryDto;
};

const usePromptFilters = (): UsePromptFiltersReturn => {
	const [page, setPage] = useState<number>(DEFAULT_PAGE);

	const { control, setValue } = useAppForm<PromptFiltersFormValues>({
		defaultValues: {
			scope: PromptScope.MINE,
			score: "",
			search: "",
			workspaceId: "",
		},
	});

	const formValues = useWatch({ control });

	const debouncedSearch = useDebounce(formValues.search ?? "", SEARCH_DELAY_MS);

	useEffect(() => {
		setPage(DEFAULT_PAGE);
	}, [
		debouncedSearch,
		formValues.score,
		formValues.workspaceId,
		formValues.scope,
	]);

	const handlePageChange = useCallback((): void => {
		setPage((previous) => previous + PAGE_INCREMENT);
	}, []);

	const handleScopeChange = useCallback(
		(scope: ValueOf<typeof PromptScope>): void => {
			setValue("scope", scope);
		},
		[setValue],
	);

	const handleScoreChange = useCallback(
		(score: number | string) => {
			return (): void => {
				setValue("score", score);
			};
		},
		[setValue],
	);

	const queryPayload: PromptGetQueryDto = {
		limit: DEFAULT_LIMIT,
		page,
		scope: formValues.scope ?? PromptScope.MINE,
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
		handleScopeChange,
		handleScoreChange,
		queryPayload,
	};
};

export { usePromptFilters };
