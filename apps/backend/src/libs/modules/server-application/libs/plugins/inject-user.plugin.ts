import { type FastifyInstance, type FastifyRequest } from "fastify";

import { HTTPHeader } from "~/libs/modules/http/http.js";

import { type AuthPayload } from "../types/auth-payload.type.js";

const BEARER_PREFIX = "Bearer ";
const EMPTY_LENGTH = 0;

const getBearerToken = (request: FastifyRequest): null | string => {
	const authorizationHeader = request.headers[HTTPHeader.AUTHORIZATION];

	if (
		typeof authorizationHeader !== "string" ||
		!authorizationHeader.startsWith(BEARER_PREFIX)
	) {
		return null;
	}

	const token = authorizationHeader.slice(BEARER_PREFIX.length);

	return token.length > EMPTY_LENGTH ? token : null;
};

const injectUser = (app: FastifyInstance): void => {
	app.decorateRequest("user", null);

	app.addHook("onRequest", (request, _reply, done) => {
		request.user = null;

		const token = getBearerToken(request);

		if (token === null) {
			done();

			return;
		}

		// TODO: verify token via token module (#23) and set request.user = { id }

		done();
	});
};

declare module "fastify" {
	interface FastifyRequest {
		user: AuthPayload | null;
	}
}

export { injectUser };
