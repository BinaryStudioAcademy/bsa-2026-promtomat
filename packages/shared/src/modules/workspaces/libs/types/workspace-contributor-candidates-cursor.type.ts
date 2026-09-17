import { z } from "zod";

import { workspaceContributorCandidatesCursor } from "../validation-schemas/workspace-contributor-candidates-cursor.validation-schema.js";

type WorkspaceContributorCandidatesCursor = z.infer<
	typeof workspaceContributorCandidatesCursor
>;

export { type WorkspaceContributorCandidatesCursor };
