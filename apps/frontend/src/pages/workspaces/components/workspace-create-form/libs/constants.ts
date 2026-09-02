import { WorkspaceVisibility } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";

const DEFAULT_WORKSPACE_CREATE_PAYLOAD: WorkspaceCreateRequestDto = {
	name: "",
	stackTags: [],
	visibility: WorkspaceVisibility.PRIVATE,
};

const FIRST_ELEMENT_INDEX = 0;

export { DEFAULT_WORKSPACE_CREATE_PAYLOAD, FIRST_ELEMENT_INDEX };
