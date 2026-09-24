import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { WORKSPACE_ID_SEARCH_PARAMETER } from "~/libs/constants/constants.js";

type Parameters = {
	selectWorkspace: (workspaceId: number) => void;
	workspaces: undefined | { id: number }[];
};

const useWorkspaceSearchParameter = ({
	selectWorkspace,
	workspaces,
}: Parameters): null | number => {
	const [searchParameters] = useSearchParams();
	const appliedWorkspaceIdReference = useRef<null | number>(null);
	const requestedWorkspaceId = Number(
		searchParameters.get(WORKSPACE_ID_SEARCH_PARAMETER),
	);
	const matchedWorkspaceId =
		workspaces?.find((workspace) => {
			return workspace.id === requestedWorkspaceId;
		})?.id ?? null;

	useEffect(() => {
		if (matchedWorkspaceId === null) {
			appliedWorkspaceIdReference.current = null;
			return;
		}

		if (appliedWorkspaceIdReference.current === matchedWorkspaceId) {
			return;
		}

		selectWorkspace(matchedWorkspaceId);
		appliedWorkspaceIdReference.current = matchedWorkspaceId;
	}, [matchedWorkspaceId, selectWorkspace]);

	return matchedWorkspaceId;
};

export { useWorkspaceSearchParameter };
