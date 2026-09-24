import { type z } from "zod";

import { type bindRepository } from "../validation-schemas/validation-schemas.js";

type CreateRepositoryBindingRequestDto = z.infer<typeof bindRepository>;

export { type CreateRepositoryBindingRequestDto };
