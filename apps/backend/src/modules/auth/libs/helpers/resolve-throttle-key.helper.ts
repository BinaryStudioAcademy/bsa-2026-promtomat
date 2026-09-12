import { type FastifyRequest } from "fastify";
import { createHash } from "node:crypto";

import { type ForgotPasswordRequestDto } from "../types/types.js";

const resolveThrottleKey = (request: FastifyRequest): string => {
	const { email } = request.body as ForgotPasswordRequestDto;

	return createHash("sha256").update(email).digest("hex");
};

export { resolveThrottleKey };
