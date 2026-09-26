import { z } from "zod";

import { WorkspaceTargets } from "../enums/enums.js";

const datasetTargetField = z.union([
	z.literal(WorkspaceTargets.SMALL),
	z.literal(WorkspaceTargets.MEDIUM),
	z.literal(WorkspaceTargets.LARGE),
	z.literal(WorkspaceTargets.EXTRA_LARGE),
]);

export { datasetTargetField };
