import { Buffer } from "node:buffer";

import { type WorkspaceContributorCandidatesCursor } from "~/modules/workspaces/libs/types/types.js";
import { workspaceContributorCandidatesCursorValidationSchema } from "~/modules/workspaces/libs/validation-schemas/validation-schemas.js";

import { CursorEncoding } from "../../enums/enums.js";

const decodeContributorCandidatesCursor = (
	cursor: string,
): WorkspaceContributorCandidatesCursor => {
	let decodedCursor: unknown;

	try {
		decodedCursor = JSON.parse(
			Buffer.from(cursor, CursorEncoding.BASE64_URL).toString(),
		);
	} catch (error) {
		if (!(error instanceof SyntaxError)) {
			throw error;
		}

		decodedCursor = null;
	}

	return workspaceContributorCandidatesCursorValidationSchema.parse(
		decodedCursor,
	);
};

export { decodeContributorCandidatesCursor };
