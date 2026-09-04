import { type z } from "zod";

import { updateProfile } from "../validation-schemas/update-profile.validation-schema.js";

type UserUpdateRequestDto = z.infer<typeof updateProfile>;

export { type UserUpdateRequestDto };
