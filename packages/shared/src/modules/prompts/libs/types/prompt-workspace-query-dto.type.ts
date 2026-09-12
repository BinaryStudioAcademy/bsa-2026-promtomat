import { z } from "zod";

import { promptWorkspaceQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptWorkspaceQueryDto = z.infer<
	typeof promptWorkspaceQueryValidationSchema
>;

export { type PromptWorkspaceQueryDto };
