import { type preHandlerAsyncHookHandler } from "fastify";

import {
	AuthError,
	ContributorError,
	WorkspaceError,
} from "~/libs/exceptions/exceptions.js";

import { type WorkspaceService } from "../../workspace.service.js";
import { type WorkspaceContributorRouteParametersDto } from "../types/types.js";

const workspaceContributorDeleteAccessHook = (
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const { userId: targetUserId, workspaceId } =
			request.params as WorkspaceContributorRouteParametersDto;
		const currentUserId = request.user.id;

		const ownedWorkspace = await workspaceService.findByIdAndOwner(
			workspaceId,
			currentUserId,
		);

		if (ownedWorkspace) {
			if (targetUserId === currentUserId) {
				throw ContributorError.ownerCannotBeRemoved();
			}

			return;
		}

		const contributedWorkspace = await workspaceService.findByIdAndContributor(
			workspaceId,
			currentUserId,
		);

		if (!contributedWorkspace) {
			throw WorkspaceError.notFound();
		}

		if (targetUserId === contributedWorkspace.userId) {
			throw ContributorError.ownerCannotBeRemoved();
		}

		if (targetUserId !== currentUserId) {
			throw WorkspaceError.forbidden();
		}
	};
};

export { workspaceContributorDeleteAccessHook };
