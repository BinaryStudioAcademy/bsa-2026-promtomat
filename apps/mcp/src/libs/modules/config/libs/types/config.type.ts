import { type Config as LibraryConfig } from "@promptomat/shared";

import { type EnvironmentSchema } from "./environment-schema.type.js";

type Config = LibraryConfig<EnvironmentSchema>;

export { type Config };
