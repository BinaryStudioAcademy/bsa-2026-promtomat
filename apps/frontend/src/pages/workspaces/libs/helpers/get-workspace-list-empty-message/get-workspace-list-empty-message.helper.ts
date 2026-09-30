import { type ValueOf } from "~/libs/types/types.js";
import { WorkspaceListScope } from "~/modules/workspaces/workspaces.js";

import { WorkspaceListMessage } from "../../enums/enums.js";

type GetWorkspaceListEmptyMessageParameters = {
	scope: ValueOf<typeof WorkspaceListScope>;
	search: string;
};

const getWorkspaceListEmptyMessage = ({
	scope,
	search,
}: GetWorkspaceListEmptyMessageParameters): ValueOf<
	typeof WorkspaceListMessage
> => {
	if (search) {
		return WorkspaceListMessage.NO_MATCHES_FOR_SEARCH;
	}

	if (scope === WorkspaceListScope.SHARED) {
		return WorkspaceListMessage.NO_SHARED_WITH_YOU;
	}

	if (scope === WorkspaceListScope.OWNED) {
		return WorkspaceListMessage.NO_CREATED_BY_YOU;
	}

	return WorkspaceListMessage.NO_MATCHES_FOR_SEARCH;
};

export { getWorkspaceListEmptyMessage };
