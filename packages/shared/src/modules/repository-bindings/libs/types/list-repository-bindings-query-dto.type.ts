import { type z } from "zod";

import { type listRepositoryBindingsQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type ListRepositoryBindingsQueryDto = z.infer<
	typeof listRepositoryBindingsQueryValidationSchema
>;

export { type ListRepositoryBindingsQueryDto };
