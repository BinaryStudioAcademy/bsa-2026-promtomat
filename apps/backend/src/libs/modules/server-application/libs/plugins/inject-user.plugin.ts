import { type FastifyInstance, type FastifyRequest } from "fastify";

import { HTTPHeader } from "~/libs/modules/http/http.js";
import { token, TokenError } from "~/libs/modules/token/token.js";

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

	app.addHook("onRequest", async (request) => {
		request.user = null;

		const bearerToken = getBearerToken(request);

		if (bearerToken === null) {
			return;
		}

		try {
			const payload = await token.verify(bearerToken);

			request.user = {
				id: payload.userId,
			};
		} catch (error) {
			if (!(error instanceof TokenError)) {
				throw error;
			}
		}
	});
};

declare module "fastify" {
	interface FastifyRequest {
		user: AuthPayload | null;
	}
}

export { injectUser };
