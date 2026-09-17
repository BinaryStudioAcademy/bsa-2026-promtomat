import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { PAGE_INCREMENT } from "~/modules/prompts/libs/constants/constants.js";
import { PaginationValue } from "~/modules/prompts/libs/enums/enums.js";

type UsePaginationReturn = {
	handlePageChange: () => void;
	page: number;
	resetPage: () => void;
};

const QUERY_KEY = "page";

const usePagination = (): UsePaginationReturn => {
	const [searchParameters, setSearchParameters] = useSearchParams();

	const parsed = Number(searchParameters.get(QUERY_KEY));
	const page =
		Number.isSafeInteger(parsed) && parsed >= PaginationValue.DEFAULT_PAGE
			? parsed
			: PaginationValue.DEFAULT_PAGE;

	const handlePageChange = useCallback((): void => {
		setSearchParameters((previous) => {
			const updated = new URLSearchParams(previous);
			const rawCurrentPage = Number(updated.get(QUERY_KEY));
			const currentPage =
				Number.isSafeInteger(rawCurrentPage) &&
				rawCurrentPage >= PaginationValue.DEFAULT_PAGE
					? rawCurrentPage
					: PaginationValue.DEFAULT_PAGE;

			updated.set(QUERY_KEY, String(currentPage + PAGE_INCREMENT));

			return updated;
		});
	}, [setSearchParameters]);

	const resetPage = useCallback((): void => {
		setSearchParameters((previous) => {
			const updated = new URLSearchParams(previous);
			updated.delete(QUERY_KEY);

			return updated;
		});
	}, [setSearchParameters]);

	return { handlePageChange, page, resetPage };
};

export { usePagination };
