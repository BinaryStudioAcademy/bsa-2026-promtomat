import { useCallback } from "react";
import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";

type SearchFormPayload = {
	search: string;
};

type UseSearchResult = {
	control: Control<SearchFormPayload, null>;
	debouncedSearch: string;
	resetSearch: () => void;
};

const SEARCH_DELAY_MS = 300;
const EMPTY_SEARCH = "";

const useSearch = (delay: number = SEARCH_DELAY_MS): UseSearchResult => {
	const { control, reset } = useAppForm<SearchFormPayload>({
		defaultValues: { search: EMPTY_SEARCH },
	});

	const search = useWatch({ control, name: "search" });

	const debouncedSearch = useDebounce(search, delay);

	const resetSearch = useCallback((): void => {
		reset({ search: EMPTY_SEARCH });
	}, [reset]);

	return {
		control,
		debouncedSearch,
		resetSearch,
	};
};

export { useSearch };
