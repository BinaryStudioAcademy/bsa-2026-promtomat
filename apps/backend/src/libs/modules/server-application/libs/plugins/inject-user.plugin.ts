import { type FastifyInstance, type FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { HTTPHeader } from "~/libs/modules/http/http.js";
import { token, TokenError } from "~/libs/modules/token/token.js";

import { type AuthPayload } from "../types/types.js";

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

const injectUser = fastifyPlugin(
	(app: FastifyInstance, _options: unknown, done: () => void): void => {
		app.addHook("onRequest", async (request) => {
			request.user = null;

			const bearerToken = getBearerToken(request);

			if (bearerToken === null) {
				return;
			}

			try {
				const payload = await token.verify<AuthPayload>(bearerToken);

				request.user = {
					userId: payload.userId,
				};
			} catch (error) {
				if (!(error instanceof TokenError)) {
					throw error;
				}
			}
		});

		done();
	},
);

export { injectUser };
