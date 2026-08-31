import { z } from "zod";

import { passwordBoundarySpaces } from "./password-boundary-spaces.validation-schema.js";
import { passwordLength } from "./password-length.validation-schema.js";

const passwordField = z.intersection(passwordLength, passwordBoundarySpaces);

export { passwordField };
