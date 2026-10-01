import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

const getWorkspaceOpenDestination = (
	workspace: WorkspaceListItemDto,
): ValueOf<typeof AppRoute> => {
	return workspace.promptCount < workspace.datasetTarget
		? AppRoute.TRAINING
		: AppRoute.GENERATE;
};

export { getWorkspaceOpenDestination };
