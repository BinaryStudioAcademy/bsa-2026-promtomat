import { type z } from "zod";

import { type repositoryBindingRouteParameters } from "../validation-schemas/validation-schemas.js";

type RepositoryBindingRouteParametersDto = z.infer<
	typeof repositoryBindingRouteParameters
>;

export { type RepositoryBindingRouteParametersDto };
