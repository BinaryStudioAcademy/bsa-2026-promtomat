import { Buffer } from "node:buffer";

import { type WorkspaceContributorCandidatesCursor } from "~/modules/workspaces/libs/types/types.js";

import { CursorEncoding } from "../../enums/enums.js";

const encodeContributorCandidatesCursor = (
	cursor: WorkspaceContributorCandidatesCursor,
): string =>
	Buffer.from(JSON.stringify(cursor)).toString(CursorEncoding.BASE64_URL);

export { encodeContributorCandidatesCursor };
