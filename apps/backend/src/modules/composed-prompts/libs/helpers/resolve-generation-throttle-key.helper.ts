import { type FastifyRequest } from "fastify";

import { AuthError } from "~/libs/exceptions/exceptions.js";

const resolveGenerationThrottleKey = (request: FastifyRequest): string => {
	if (!request.user) {
		throw AuthError.unauthorized();
	}

	return String(request.user.id);
};

export { resolveGenerationThrottleKey };
