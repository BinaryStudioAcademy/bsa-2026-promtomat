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

		const body = request.body as undefined | { workspaceId?: number };
		const query = request.query as { workspaceId?: number | string };

		const workspaceId = body?.workspaceId ?? query.workspaceId;

		if (!workspaceId) {
			throw WorkspaceError.notFound();
		}

		const workspace = await workspaceService.findByIdAndOwner(
			Number(workspaceId),
			request.user.id,
		);

		if (!workspace) {
			throw WorkspaceError.notFound();
		}
	};
};

export { workspaceAccessHook };
