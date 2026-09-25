import { type z } from "zod";

import { type updateRepositoryBindingValidationSchema } from "../validation-schemas/validation-schemas.js";

type UpdateRepositoryBindingRequestDto = z.infer<
	typeof updateRepositoryBindingValidationSchema
>;

export { type UpdateRepositoryBindingRequestDto };
