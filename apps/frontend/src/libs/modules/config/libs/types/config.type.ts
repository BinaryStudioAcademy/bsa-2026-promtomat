import { type Config as LibraryConfig } from "@promptomat/shared";

import { EnvironmentSchema } from "./types.js";

type Config = LibraryConfig<EnvironmentSchema>;

export { type Config };
