import { type z } from "zod";

import { type repositoryBindingRouteParametersValidationSchema } from "../validation-schemas/validation-schemas.js";

type RepositoryBindingRouteParametersDto = z.infer<
	typeof repositoryBindingRouteParametersValidationSchema
>;

export { type RepositoryBindingRouteParametersDto };
