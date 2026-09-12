import { type WorkspaceUserSummaryDto } from "./workspace-user-summary-dto.type.js";

type WorkspaceContributorCandidatesResponseDto = {
	items: WorkspaceUserSummaryDto[];
	nextCursor: null | string;
};

export { type WorkspaceContributorCandidatesResponseDto };
