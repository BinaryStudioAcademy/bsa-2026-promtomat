import {
	EMPTY_LENGTH,
	FIRST_ELEMENT_INDEX,
} from "~/libs/constants/constants.js";

import { StoredWorkspaceStatus } from "../enums/enums.js";
import {
	type StoredWorkspaceState,
	type WorkspaceListItemDto,
} from "../types/types.js";

type Parameters = {
	formWorkspaceId: number | undefined;
	storedWorkspaceState: StoredWorkspaceState;
	workspaces: undefined | WorkspaceListItemDto[];
};

const resolveActiveWorkspaceId = ({
	formWorkspaceId,
	storedWorkspaceState,
	workspaces,
}: Parameters): number | undefined => {
	if (!workspaces || workspaces.length === EMPTY_LENGTH) {
		return undefined;
	}

	const formWorkspace = workspaces.find(({ id }) => id === formWorkspaceId);

	if (formWorkspace) {
		return formWorkspace.id;
	}

	if (storedWorkspaceState.status === StoredWorkspaceStatus.LOADING) {
		return undefined;
	}

	const storedWorkspace = workspaces.find(
		({ id }) => id === storedWorkspaceState.workspaceId,
	);

	return storedWorkspace?.id ?? workspaces[FIRST_ELEMENT_INDEX]?.id;
};

export { resolveActiveWorkspaceId };
