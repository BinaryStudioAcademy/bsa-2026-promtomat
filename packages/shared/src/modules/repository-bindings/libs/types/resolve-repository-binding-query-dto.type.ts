import { type z } from "zod";

import { type resolveRepositoryBindingQueryValidationSchema } from "../validation-schemas/validation-schemas.js";

type ResolveRepositoryBindingQueryDto = z.infer<
	typeof resolveRepositoryBindingQueryValidationSchema
>;

export { type ResolveRepositoryBindingQueryDto };
