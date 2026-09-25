import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";

import { WORKSPACE_INITIALS_LENGTH } from "../constants/constants.js";

const getWorkspaceInitials = (name: string): string => {
	return name
		.slice(FIRST_ELEMENT_INDEX, WORKSPACE_INITIALS_LENGTH)
		.toLowerCase();
};

export { getWorkspaceInitials };
