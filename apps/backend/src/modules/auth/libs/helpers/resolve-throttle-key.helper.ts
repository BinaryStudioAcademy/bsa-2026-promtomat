import { type FastifyRequest } from "fastify";

import { type ForgotPasswordRequestDto } from "../types/types.js";
import { hashThrottleKey } from "./password-reset-token.helper.js";

const resolveThrottleKey = (request: FastifyRequest): string => {
	const { email } = request.body as ForgotPasswordRequestDto;

	return hashThrottleKey(email);
};

export { resolveThrottleKey };
