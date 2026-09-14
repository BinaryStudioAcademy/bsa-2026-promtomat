import { type FastifyRequest } from "fastify";
import { createHash } from "node:crypto";

import { HASH_ALGORITHM, HASH_ENCODING } from "~/libs/constants/constants.js";

import { type ForgotPasswordRequestDto } from "../types/types.js";

const resolveThrottleKey = (request: FastifyRequest): string => {
	const { email } = request.body as ForgotPasswordRequestDto;

	return createHash(HASH_ALGORITHM).update(email).digest(HASH_ENCODING);
};

export { resolveThrottleKey };
