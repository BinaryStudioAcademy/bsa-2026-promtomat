import { type WorkspaceAddContributorRequestDto } from "~/modules/workspaces/libs/types/types.js";

type ContributorCreatePayload = WorkspaceAddContributorRequestDto & {
	workspaceId: number;
};

export { type ContributorCreatePayload };
