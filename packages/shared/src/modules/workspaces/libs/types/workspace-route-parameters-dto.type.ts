import { z } from "zod";

import { workspaceRouteParametersValidationSchema } from "../validation-schemas/validation-schemas.js";

type WorkspaceRouteParametersDto = z.infer<
	typeof workspaceRouteParametersValidationSchema
>;

export { type WorkspaceRouteParametersDto };
