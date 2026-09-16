import { useEffect, useState } from "react";

import { PaginationValue } from "~/modules/prompts/libs/enums/enums.js";
import { type PromptGetQueryDto } from "~/modules/prompts/libs/types/types.js";

type Parameters = {
	debouncedSearch: string;
	page: number;
	resetPage: () => void;
	score: number | string;
	workspaceId: null | number;
};

const usePromptQueryPayload = ({
	debouncedSearch,
	page,
	resetPage,
	score,
	workspaceId,
}: Parameters): PromptGetQueryDto => {
	const [queryPayload, setQueryPayload] = useState<PromptGetQueryDto>({
		limit: PaginationValue.DEFAULT_LIMIT,
		page,
		score: typeof score === "number" ? score : undefined,
		search: debouncedSearch || undefined,
		workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
	});

	useEffect(() => {
		const nextScore = typeof score === "number" ? score : undefined;
		const nextSearch = debouncedSearch || undefined;
		const nextWorkspaceId =
			typeof workspaceId === "number" ? workspaceId : undefined;

		setQueryPayload((previousPayload) => {
			const hasFiltersChanged =
				previousPayload.score !== nextScore ||
				previousPayload.search !== nextSearch ||
				previousPayload.workspaceId !== nextWorkspaceId;

			if (hasFiltersChanged && page !== PaginationValue.DEFAULT_PAGE) {
				resetPage();
				return previousPayload;
			}

			const nextPayload = {
				limit: PaginationValue.DEFAULT_LIMIT,
				page,
				score: nextScore,
				search: nextSearch,
				workspaceId: nextWorkspaceId,
			};

			if (JSON.stringify(previousPayload) === JSON.stringify(nextPayload)) {
				return previousPayload;
			}

			return nextPayload;
		});
	}, [debouncedSearch, page, resetPage, score, workspaceId]);

	return queryPayload;
};

export { usePromptQueryPayload };
