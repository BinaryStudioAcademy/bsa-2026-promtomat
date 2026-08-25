import { z } from "zod";

import { signIn } from "../validation-schemas/sign-in.validation-schema.js";

type SignInRequestDto = z.infer<typeof signIn>;

export { type SignInRequestDto };
