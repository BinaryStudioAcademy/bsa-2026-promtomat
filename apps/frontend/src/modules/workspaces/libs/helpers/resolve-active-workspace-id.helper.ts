import {
	EMPTY_LENGTH,
	FIRST_ELEMENT_INDEX,
} from "~/libs/constants/constants.js";

import { type WorkspaceListItemDto } from "../types/types.js";

type Parameters = {
	formWorkspaceId: number | undefined;
	storedWorkspaceId: null | number | undefined;
	workspaces: undefined | WorkspaceListItemDto[];
};

const resolveActiveWorkspaceId = ({
	formWorkspaceId,
	storedWorkspaceId,
	workspaces,
}: Parameters): number | undefined => {
	if (workspaces === undefined || workspaces.length === EMPTY_LENGTH) {
		return undefined;
	}

	const formWorkspace = workspaces.find(({ id }) => id === formWorkspaceId);

	if (formWorkspace) {
		return formWorkspace.id;
	}

	if (storedWorkspaceId === undefined) {
		return undefined;
	}

	const storedWorkspace = workspaces.find(({ id }) => id === storedWorkspaceId);

	return storedWorkspace?.id ?? workspaces[FIRST_ELEMENT_INDEX]?.id;
};

export { resolveActiveWorkspaceId };
