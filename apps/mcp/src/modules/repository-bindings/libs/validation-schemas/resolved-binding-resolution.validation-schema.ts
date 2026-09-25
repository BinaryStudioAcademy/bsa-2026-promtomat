import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";

const resolvedBindingResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.RESOLVED),
	workspaceId: z.number(),
});

export { resolvedBindingResolution };
