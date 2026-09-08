import { preHandlerAsyncHookHandler } from "fastify";

import { AuthError, WorkspaceError } from "~/libs/exceptions/exceptions.js";

import { WorkspaceService } from "../../workspace.service.js";

const workspaceAccessHook = (
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const workspaceId = (request.body as { workspaceId: number }).workspaceId;

		const workspace = await workspaceService.findById(workspaceId);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}

		const isOwner = workspace.userId === request.user.id;

		if (!isOwner) {
			throw WorkspaceError.notFound();
		}
	};
};

export { workspaceAccessHook };
