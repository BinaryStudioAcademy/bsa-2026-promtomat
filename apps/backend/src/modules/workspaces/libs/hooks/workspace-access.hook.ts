import { type preHandlerAsyncHookHandler } from "fastify";

import { AuthError, WorkspaceError } from "~/libs/exceptions/exceptions.js";

import { type WorkspaceService } from "../../workspace.service.js";

const workspaceAccessHook = (
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const routeParameters = request.params as { workspaceId?: number };
		const requestBody = request.body as null | { workspaceId?: number };
		const requestQuery = request.query as undefined | { workspaceId?: number };

		const workspaceId =
			routeParameters.workspaceId ??
			requestBody?.workspaceId ??
			requestQuery?.workspaceId;

		if (!workspaceId) {
			throw WorkspaceError.notFound();
		}

		const workspace = await workspaceService.findByIdAndOwner(
			workspaceId,
			request.user.id,
		);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}
	};
};

export { workspaceAccessHook };
