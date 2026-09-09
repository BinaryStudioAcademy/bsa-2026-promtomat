import { type preHandlerAsyncHookHandler } from "fastify";

import { AuthError, WorkspaceError } from "~/libs/exceptions/exceptions.js";
import { type MembershipService } from "~/modules/memberships/membership.service.js";

const createWorkspaceAccessHook = (
	membershipService: MembershipService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const routeParameters = request.params as { id?: string };
		const requestBody = request.body as null | { workspaceId?: number };
		const workspaceId = Number(routeParameters.id ?? requestBody?.workspaceId);

		if (Number.isNaN(workspaceId)) {
			throw WorkspaceError.notFound();
		}

		const membership = await membershipService.findByUserIdAndWorkspaceId(
			request.user.id,
			workspaceId,
		);

		if (membership === null) {
			throw WorkspaceError.notFound();
		}
	};
};

export { createWorkspaceAccessHook };
