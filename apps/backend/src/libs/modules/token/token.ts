import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.module.js";

const token = new BaseToken(config);

export { token };
export { type Token } from "./libs/types/types.js";
