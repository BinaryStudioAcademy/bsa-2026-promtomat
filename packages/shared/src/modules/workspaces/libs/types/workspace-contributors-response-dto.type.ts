import { type WorkspaceUserSummaryDto } from "./workspace-user-summary-dto.type.js";

type WorkspaceContributorsResponseDto = {
	contributors: WorkspaceUserSummaryDto[];
	owner: WorkspaceUserSummaryDto;
};

export { type WorkspaceContributorsResponseDto };
