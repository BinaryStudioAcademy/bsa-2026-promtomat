import { config } from "~/libs/modules/config/config.js";

import { ScryptHashing } from "./scrypt-hashing.module.js";

const hashing = new ScryptHashing(config.ENV.HASHING.SALT_LENGTH);

export { hashing };
export { type Hashing } from "./libs/types/types.js";
