import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { candidateWorkspace } from "./candidate-workspace.validation-schema.js";

const ambiguousBindingResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.AMBIGUOUS),
	workspaces: z.array(candidateWorkspace),
});

export { ambiguousBindingResolution };
