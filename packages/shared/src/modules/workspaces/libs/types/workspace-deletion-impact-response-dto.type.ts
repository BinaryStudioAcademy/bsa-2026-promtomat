import { z } from "zod";

import { workspaceDeletionImpactValidationSchema } from "../validation-schemas/validation-schemas.js";

type WorkspaceDeletionImpactResponseDto = z.infer<
	typeof workspaceDeletionImpactValidationSchema
>;

export { type WorkspaceDeletionImpactResponseDto };
