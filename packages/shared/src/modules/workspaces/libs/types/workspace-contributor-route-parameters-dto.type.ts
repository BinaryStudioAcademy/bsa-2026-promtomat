import { z } from "zod";

import { workspaceContributorRouteParametersValidationSchema } from "../validation-schemas/validation-schemas.js";

type WorkspaceContributorRouteParametersDto = z.infer<
	typeof workspaceContributorRouteParametersValidationSchema
>;

export { type WorkspaceContributorRouteParametersDto };
