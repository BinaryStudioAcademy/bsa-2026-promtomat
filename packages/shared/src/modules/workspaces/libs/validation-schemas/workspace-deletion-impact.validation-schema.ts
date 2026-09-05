import { z } from "zod";

const workspaceDeletionImpact = z.strictObject({
	canDelete: z.boolean(),
	promptCount: z.number().int().nonnegative(),
});

export { workspaceDeletionImpact };
