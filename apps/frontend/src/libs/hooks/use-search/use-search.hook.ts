import { type Control, useWatch } from "react-hook-form";

import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useDebounce } from "~/libs/hooks/use-debounce/use-debounce.hook.js";

type SearchFormPayload = {
	search: string;
};

type UseSearchResult = {
	control: Control<SearchFormPayload, null>;
	debouncedSearch: string;
};

const SEARCH_DELAY_MS = 300;

const useSearch = (delay: number = SEARCH_DELAY_MS): UseSearchResult => {
	const { control } = useAppForm<SearchFormPayload>({
		defaultValues: { search: "" },
	});

	const search = useWatch({ control, name: "search" });

	const debouncedSearch = useDebounce(search, delay);
	return {
		control,
		debouncedSearch,
	};
};
export { useSearch };
