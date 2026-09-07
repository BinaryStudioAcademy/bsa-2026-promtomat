import { type ValueOf } from "~/libs/types/types.js";

import { WorkspaceVisibility } from "../enums/enums.js";

type WorkspaceEntityInitializeNewPayload = {
	name: string;
	stackTags?: string[] | undefined;
	userId: number;
	visibility?: undefined | ValueOf<typeof WorkspaceVisibility>;
};

export { type WorkspaceEntityInitializeNewPayload };
