import { z } from "zod";

const workspaceContributorCandidatesQuery = z.strictObject({
	cursor: z.string().nonempty().optional(),
	userQuery: z.string().trim().optional(),
});

export { workspaceContributorCandidatesQuery };
