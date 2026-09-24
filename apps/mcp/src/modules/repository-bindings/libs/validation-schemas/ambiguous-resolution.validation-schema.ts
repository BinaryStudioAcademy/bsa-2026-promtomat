import { z } from "zod";

import { RepositoryBindingResolutionStatus } from "../enums/enums.js";
import { resolutionWorkspace } from "./resolution-workspace.validation-schema.js";

const ambiguousResolution = z.object({
	status: z.literal(RepositoryBindingResolutionStatus.AMBIGUOUS),
	workspaces: z.array(resolutionWorkspace),
});

export { ambiguousResolution };
