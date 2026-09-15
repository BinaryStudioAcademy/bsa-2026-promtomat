import { type WorkspaceContributorCandidatesCursor } from "~/modules/workspaces/libs/types/types.js";

type ContributorCandidateQuery = {
	cursor?: WorkspaceContributorCandidatesCursor;
	limit: number;
	ownerId: number;
	userQuery: string;
	workspaceId: number;
};

export { type ContributorCandidateQuery };
