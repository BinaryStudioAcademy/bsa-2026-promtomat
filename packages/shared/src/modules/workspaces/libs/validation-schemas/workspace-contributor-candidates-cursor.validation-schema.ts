import { z } from "zod";

const workspaceContributorCandidatesCursor = z.strictObject({
	id: z.number().int().positive(),
	nickname: z.string().nonempty(),
});

export { workspaceContributorCandidatesCursor };
