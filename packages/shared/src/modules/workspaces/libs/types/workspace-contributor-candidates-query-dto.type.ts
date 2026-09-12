import { z } from "zod";

import { workspaceContributorCandidatesQuery } from "../validation-schemas/workspace-contributor-candidates-query.validation-schema.js";

type WorkspaceContributorCandidatesQueryDto = z.infer<
	typeof workspaceContributorCandidatesQuery
>;

export { type WorkspaceContributorCandidatesQueryDto };
