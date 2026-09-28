import { EMPTY_LENGTH, ZERO_VALUE } from "~/libs/constants/constants.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import { type WorkspaceCollectionStats } from "../../types/types.js";

const getWorkspaceCollectionStats = (
	workspaces: WorkspaceListItemDto[],
): WorkspaceCollectionStats => {
	const scoredAverages = workspaces.flatMap((workspace) =>
		workspace.averageScore === null ? [] : [workspace.averageScore],
	);
	const promptCount = workspaces.reduce(
		(total, workspace) => total + workspace.promptCount,
		ZERO_VALUE,
	);
	const averageScore =
		scoredAverages.length === EMPTY_LENGTH
			? null
			: scoredAverages.reduce((total, score) => total + score, ZERO_VALUE) /
				scoredAverages.length;

	return {
		averageScore,
		promptCount,
		workspaceCount: workspaces.length,
	};
};

export { getWorkspaceCollectionStats };
