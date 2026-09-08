import { preHandlerAsyncHookHandler } from "fastify";

import { AuthError, WorkspaceError } from "~/libs/exceptions/exceptions.js";

import { WorkspaceService } from "../../workspace.service.js";

const workspaceQueryAccessHook = (
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const workspaceId = (request.query as { workspaceId: number }).workspaceId;

		const workspace = await workspaceService.findByIdAndOwner(
			workspaceId,
			request.user.id,
		);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}
	};
};

export { workspaceQueryAccessHook };
