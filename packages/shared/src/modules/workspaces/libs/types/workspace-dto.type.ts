import { type ValueOf } from "../../../../libs/types/value-of.type.js";
import { WorkspaceVisibility } from "../enums/workspace-visibility.enum.js";

type WorkspaceDto = {
	id: number;
	name: string;
	stackTags: string[];
	userId: number;
	visibility: ValueOf<typeof WorkspaceVisibility>;
};

export { type WorkspaceDto };
