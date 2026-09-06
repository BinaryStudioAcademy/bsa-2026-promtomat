import { WorkspaceVisibility } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";

const DEFAULT_WORKSPACE_CREATE_PAYLOAD: WorkspaceCreateRequestDto = {
	name: "",
	stackTags: [],
	visibility: WorkspaceVisibility.PRIVATE,
};

export { DEFAULT_WORKSPACE_CREATE_PAYLOAD };
