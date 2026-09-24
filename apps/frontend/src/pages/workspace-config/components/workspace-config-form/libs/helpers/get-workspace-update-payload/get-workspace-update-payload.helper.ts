import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type WorkspaceUpdateRequestDto } from "~/modules/workspaces/libs/types/types.js";

import { type WorkspaceEditableFields } from "../../types/types.js";
import { checkIsStackTagsEqual } from "../check-is-stack-tags-equal/check-is-stack-tags-equal.helper.js";

const getWorkspaceUpdatePayload = (
	values: WorkspaceEditableFields,
	workspace: WorkspaceEditableFields,
): null | WorkspaceUpdateRequestDto => {
	const payload: WorkspaceUpdateRequestDto = {};

	if (values.description !== workspace.description) {
		payload.description = values.description;
	}

	if (values.name !== workspace.name) {
		payload.name = values.name;
	}

	if (!checkIsStackTagsEqual(values.stackTags, workspace.stackTags)) {
		payload.stackTags = values.stackTags;
	}

	return Object.keys(payload).length === EMPTY_LENGTH ? null : payload;
};

export { getWorkspaceUpdatePayload };
