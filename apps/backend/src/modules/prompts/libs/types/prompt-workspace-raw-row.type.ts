import { type PromptDto } from "./types.js";

type PromptWorkspaceRawRow = Omit<PromptDto, "computedScore"> & {
	computedScore: null | number | string;
};

export { type PromptWorkspaceRawRow };
