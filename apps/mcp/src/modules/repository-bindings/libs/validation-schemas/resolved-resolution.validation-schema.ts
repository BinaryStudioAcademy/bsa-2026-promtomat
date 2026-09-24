import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";

const resolvedResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.RESOLVED),
	workspaceId: z.number(),
});

export { resolvedResolution };
