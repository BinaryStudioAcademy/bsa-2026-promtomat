import { type WorkspaceDto } from "./workspace-dto.type.js";

type WorkspaceListItemDto = WorkspaceDto & {
	averageScore: null | number;
	memberCount: number;
	promptCount: number;
	recentActivity: number;
};

export { type WorkspaceListItemDto };
