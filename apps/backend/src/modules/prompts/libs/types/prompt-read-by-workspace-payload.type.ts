import { type PromptWorkspaceQueryDto } from "./types.js";

type PromptReadByWorkspacePayload = PromptWorkspaceQueryDto & {
	userId: number;
};

export { type PromptReadByWorkspacePayload };
