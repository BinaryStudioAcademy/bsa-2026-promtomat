import { WorkspaceError } from "@promptomat/shared";
import { type preHandlerAsyncHookHandler } from "fastify";

import { type MembershipService } from "~/modules/memberships/membership.service.js";

const createWorkspaceAccessHook = (
	membershipService: MembershipService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (request.user === null) {
			throw WorkspaceError.notFound();
		}

		const workspaceId = Number((request.params as { id: string }).id);

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
