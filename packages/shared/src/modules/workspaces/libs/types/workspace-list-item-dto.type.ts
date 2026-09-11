import { type WorkspaceDto } from "./workspace-dto.type.js";

type WorkspaceListItemDto = WorkspaceDto & {
	promptCount: number;
};

export { type WorkspaceListItemDto };
