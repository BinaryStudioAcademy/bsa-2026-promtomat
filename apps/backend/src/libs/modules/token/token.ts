import { config } from "~/libs/modules/config/config.js";

import { JwtTokenService } from "./jwt-token.service.js";

const token = new JwtTokenService({
	alg: config.ENV.JWT.ALG,
	expiresIn: config.ENV.JWT.EXPIRES_IN,
	secret: new TextEncoder().encode(config.ENV.JWT.SECRET),
});

export { token };
export { type TokenService } from "./libs/types/types.js";
