import { type preHandlerAsyncHookHandler } from "fastify";

import { AuthError, WorkspaceError } from "~/libs/exceptions/exceptions.js";

import { type WorkspaceService } from "../../workspace.service.js";

const workspaceOwnerAccessHook = (
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const routeParameters = request.params as { workspaceId?: number };
		const requestBody = request.body as null | { workspaceId?: number };

		const workspaceId = routeParameters.workspaceId ?? requestBody?.workspaceId;

		if (!workspaceId) {
			throw WorkspaceError.notFound();
		}

		const ownedWorkspace = await workspaceService.findByIdAndOwner(
			workspaceId,
			request.user.id,
		);

		if (ownedWorkspace) {
			return;
		}
		const contributedWorkspace = await workspaceService.findByIdAndContributor(
			workspaceId,
			request.user.id,
		);

		if (contributedWorkspace) {
			throw WorkspaceError.forbidden();
		}

		throw WorkspaceError.notFound();
	};
};

export { workspaceOwnerAccessHook };
