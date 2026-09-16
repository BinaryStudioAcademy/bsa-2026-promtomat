import { type z } from "zod";

import { compose } from "../validation-schemas/compose.validation-schema.js";

type ComposeRequestDto = z.infer<typeof compose>;

export { type ComposeRequestDto };
