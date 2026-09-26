import { type ValueOf } from "../../../../libs/types/value-of.type.js";
import { type WorkspaceTargets } from "../enums/enums.js";
import { WorkspaceVisibility } from "../enums/workspace-visibility.enum.js";

type WorkspaceDto = {
	datasetTarget: ValueOf<typeof WorkspaceTargets>;
	description: string;
	id: number;
	name: string;
	stackTags: string[];
	userId: number;
	visibility: ValueOf<typeof WorkspaceVisibility>;
};

export { type WorkspaceDto };
