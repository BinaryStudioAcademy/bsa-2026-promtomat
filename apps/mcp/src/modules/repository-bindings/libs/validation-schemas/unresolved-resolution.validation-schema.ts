import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";

const unresolvedResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.UNRESOLVED),
});

export { unresolvedResolution };
