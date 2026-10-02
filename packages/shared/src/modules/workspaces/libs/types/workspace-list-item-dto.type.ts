import { type WorkspaceDto } from "./workspace-dto.type.js";

type WorkspaceListItemDto = WorkspaceDto & {
	averageScore: null | number;
	memberCount: number;
	promptCount: number;
	topActivity: number;
};

export { type WorkspaceListItemDto };
