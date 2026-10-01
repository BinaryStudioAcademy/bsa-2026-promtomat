import { type preHandlerAsyncHookHandler } from "fastify";

import {
	AuthError,
	RepositoryBindingError,
	WorkspaceError,
} from "~/libs/exceptions/exceptions.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type RepositoryBindingService } from "../../repository-binding.service.js";

const repositoryBindingOwnerAccessHook = (
	repositoryBindingService: RepositoryBindingService,
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const routeParameters = request.params as {
			repositoryBindingId?: number;
		};
		const repositoryBindingId = routeParameters.repositoryBindingId;

		if (!repositoryBindingId) {
			throw RepositoryBindingError.notFound();
		}

		const repositoryBinding =
			await repositoryBindingService.findById(repositoryBindingId);

		if (!repositoryBinding) {
			throw RepositoryBindingError.notFound();
		}

		const ownedWorkspace = await workspaceService.findByIdAndOwner(
			repositoryBinding.workspaceId,
			request.user.id,
		);

		if (ownedWorkspace) {
			return;
		}

		const contributedWorkspace = await workspaceService.findByIdAndContributor(
			repositoryBinding.workspaceId,
			request.user.id,
		);

		if (contributedWorkspace) {
			throw WorkspaceError.forbidden();
		}

		throw RepositoryBindingError.notFound();
	};
};

export { repositoryBindingOwnerAccessHook };
