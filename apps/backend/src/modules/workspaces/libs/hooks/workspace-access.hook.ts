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

		const requestBody = request.body as undefined | { workspaceId?: number };
		const requestQuery = request.query as undefined | { workspaceId?: number };
		const workspaceId = requestBody?.workspaceId ?? requestQuery?.workspaceId;

		if (workspaceId === undefined) {
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
