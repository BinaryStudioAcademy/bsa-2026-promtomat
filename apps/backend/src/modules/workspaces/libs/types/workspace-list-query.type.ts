import { type ValueOf } from "~/libs/types/types.js";

import { WorkspaceListScope, WorkspaceListSort } from "../enums/enums.js";

type WorkspaceListQuery = {
	scope: ValueOf<typeof WorkspaceListScope>;
	sort?: undefined | ValueOf<typeof WorkspaceListSort>;
	workspaceName?: string | undefined;
};

export { type WorkspaceListQuery };
