import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { candidateWorkspace } from "./candidate-workspace.validation-schema.js";

const unresolvedBindingResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.UNRESOLVED),
	workspaces: z.array(candidateWorkspace),
});

export { unresolvedBindingResolution };
