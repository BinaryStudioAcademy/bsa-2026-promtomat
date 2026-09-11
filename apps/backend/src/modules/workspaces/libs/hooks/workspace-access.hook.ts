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

		const workspaceId =
			(request.body as undefined | { workspaceId?: number })?.workspaceId ??
			(request.query as undefined | { workspaceId?: number })?.workspaceId;

		if (!workspaceId) {
			return;
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
