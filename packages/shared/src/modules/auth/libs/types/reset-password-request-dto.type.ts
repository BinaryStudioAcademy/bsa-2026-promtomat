import { z } from "zod";

import { resetPassword } from "../validation-schemas/reset-password.validation-schema.js";

type ResetPasswordRequestDto = z.infer<typeof resetPassword>;

export { type ResetPasswordRequestDto };
