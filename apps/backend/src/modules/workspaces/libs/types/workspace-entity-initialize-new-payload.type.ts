import { type WorkspaceTarget } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { WorkspaceVisibility } from "../enums/enums.js";

type WorkspaceEntityInitializeNewPayload = {
	datasetTarget: ValueOf<typeof WorkspaceTarget>;
	description?: string | undefined;
	name: string;
	stackTags?: string[] | undefined;
	userId: number;
	visibility?: undefined | ValueOf<typeof WorkspaceVisibility>;
};

export { type WorkspaceEntityInitializeNewPayload };
