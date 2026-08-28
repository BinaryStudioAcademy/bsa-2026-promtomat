import { type FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { FastifyHook } from "~/libs/enums/enums.js";

import { type AuthGuard } from "../../auth-guard.module.js";
import { isPublicRoute } from "../helpers/helpers.js";
import { type HttpMethodValue } from "../types/types.js";

type PluginOptions = {
	authGuard: AuthGuard;
};

const authGuardPlugin = fp<PluginOptions>(
	(fastify: FastifyInstance, options) => {
		const { authGuard } = options;

		fastify.decorateRequest("user", null);

		fastify.addHook(FastifyHook.ON_REQUEST, async (request: FastifyRequest) => {
			const lookupPath = request.routeOptions.url ?? request.url;
			const currentMethod = request.method.toUpperCase() as HttpMethodValue;

			if (isPublicRoute(lookupPath, currentMethod)) {
				return;
			}

			request.user = await authGuard.resolveUser(request.headers.authorization);
		});
	},
);

export { authGuardPlugin };
