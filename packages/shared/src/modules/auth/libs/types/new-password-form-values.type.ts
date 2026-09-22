import { type z } from "zod";

import { type newPassword } from "../validation-schemas/new-password.validation-schema.js";

type NewPasswordFormValues = z.infer<typeof newPassword>;

export { type NewPasswordFormValues };
