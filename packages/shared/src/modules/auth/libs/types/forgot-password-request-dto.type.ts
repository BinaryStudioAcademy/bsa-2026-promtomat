import { z } from "zod";

import { forgotPassword } from "../validation-schemas/forgot-password.validation-schema.js";

type ForgotPasswordRequestDto = z.infer<typeof forgotPassword>;

export { type ForgotPasswordRequestDto };
