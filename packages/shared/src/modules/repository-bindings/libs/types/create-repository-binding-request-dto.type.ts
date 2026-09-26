import { type z } from "zod";

import { type bindRepositoryValidationSchema } from "../validation-schemas/validation-schemas.js";

type CreateRepositoryBindingRequestDto = z.infer<
	typeof bindRepositoryValidationSchema
>;

export { type CreateRepositoryBindingRequestDto };
