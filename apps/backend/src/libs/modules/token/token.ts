import { config } from "~/libs/modules/config/config.js";

import { JwtTokenService } from "./jwt-token.service.js";

const token = new JwtTokenService(config);

export { token };
export { type TokenService } from "./libs/types/types.js";
