import { z } from "zod";

import { resolutionWorkspace } from "./resolution-workspace.validation-schema.js";

const ambiguousResolution = z.object({
	status: z.literal("ambiguous"),
	workspaces: z.array(resolutionWorkspace),
});

export { ambiguousResolution };
