import { WorkspaceVisibility } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "~/modules/workspaces/libs/types/types.js";

const DEFAULT_WORKSPACE_CREATE_PAYLOAD: WorkspaceCreateRequestDto = {
	name: "",
	stackTags: [],
	visibility: WorkspaceVisibility.PRIVATE,
};

const WORKSPACE_STACK_TAG_OPTIONS = [
	{ label: "React", value: "react" },
	{ label: "Node.js", value: "node" },
	{ label: "TypeScript", value: "typescript" },
];

const FIRST_ELEMENT_INDEX = 0;

export {
	DEFAULT_WORKSPACE_CREATE_PAYLOAD,
	FIRST_ELEMENT_INDEX,
	WORKSPACE_STACK_TAG_OPTIONS,
};
