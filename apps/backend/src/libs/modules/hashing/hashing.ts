import { config } from "~/libs/modules/config/config.js";

import { BaseHashing } from "./base-hashing.module.js";

const hashing = new BaseHashing(config.ENV.HASHING.SALT_LENGTH);

export { hashing };
export { type Hashing } from "./libs/types/types.js";
