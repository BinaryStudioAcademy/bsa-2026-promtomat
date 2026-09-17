import { type z } from "zod";

import { type createRepositoryBinding } from "../validation-schemas/validation-schemas.js";

type CreateRepositoryBindingRequestDto = z.infer<
	typeof createRepositoryBinding
>;

export { type CreateRepositoryBindingRequestDto };
