import { type WorkspaceDto } from "./workspace-dto.type.js";

type WorkspaceListItemDto = WorkspaceDto & {
	memberCount: number;
	promptCount: number;
};

export { type WorkspaceListItemDto };
