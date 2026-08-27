import type { FastifyInstance, FastifyRequest } from "fastify";

import fp from "fastify-plugin";

import type { AuthGuard } from "./auth-guard.js";

import { PUBLIC_ROUTES } from "./libs/enums/enums.js";

type PluginOptions = {
	authGuard: AuthGuard;
};

const authGuardPlugin = fp<PluginOptions>(
	(fastify: FastifyInstance, options) => {
		const { authGuard } = options;

		fastify.decorateRequest("user", null);

		fastify.addHook("onRequest", async (request: FastifyRequest) => {
			if (PUBLIC_ROUTES.some((prefix) => request.url.startsWith(prefix))) {
				return;
			}

			request.user = await authGuard.resolveUser(request.headers.authorization);
		});
	},
);

export { authGuardPlugin };
