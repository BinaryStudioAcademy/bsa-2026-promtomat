import { RepositoryBindingError } from "~/libs/exceptions/exceptions.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import {
	RepositoryBindingResolutionStatus,
	RepositoryIdentityRefusalReason,
} from "./libs/enums/enums.js";
import { normalizeRepositoryIdentity } from "./libs/helpers/helpers.js";
import {
	type CreateRepositoryBindingRequestDto,
	type RepositoryBindingDto,
	type RepositoryBindingResolution,
	type RepositoryIdentity,
	type ResolveRepositoryBindingQueryDto,
} from "./libs/types/types.js";
import { RepositoryBindingEntity } from "./repository-binding.entity.js";
import { type RepositoryBindingRepository } from "./repository-binding.repository.js";

class RepositoryBindingService {
	private repositoryBindingRepository: RepositoryBindingRepository;

	private workspaceService: WorkspaceService;

	public constructor(
		repositoryBindingRepository: RepositoryBindingRepository,
		workspaceService: WorkspaceService,
	) {
		this.repositoryBindingRepository = repositoryBindingRepository;
		this.workspaceService = workspaceService;
	}

	private resolveIdentityOrThrow(remoteUrl: string): RepositoryIdentity {
		const outcome = normalizeRepositoryIdentity(remoteUrl);

		if (outcome.identity) {
			return outcome.identity;
		}

		if (
			outcome.reason === RepositoryIdentityRefusalReason.NO_REMOTE_CONFIGURED
		) {
			throw RepositoryBindingError.noRemoteConfigured();
		}

		throw RepositoryBindingError.unrecognizedFormat();
	}

	public async create(
		payload: CreateRepositoryBindingRequestDto,
	): Promise<RepositoryBindingDto> {
		const identity = this.resolveIdentityOrThrow(payload.remoteUrl);

		const repositoryBinding = await this.repositoryBindingRepository.create(
			RepositoryBindingEntity.initializeNew({
				identity,
				workspaceId: payload.workspaceId,
			}),
		);

		return repositoryBinding.toObject();
	}

	public async resolve(
		payload: ResolveRepositoryBindingQueryDto,
		callerUserId: number,
	): Promise<RepositoryBindingResolution> {
		const identity = this.resolveIdentityOrThrow(payload.remoteUrl);

		const { items: accessibleWorkspaces } =
			await this.workspaceService.findAllByUserId(callerUserId, {});

		const matchingWorkspaceIds =
			await this.repositoryBindingRepository.findWorkspaceIdsByIdentity(
				identity,
				accessibleWorkspaces.map((workspace) => workspace.id),
			);

		if (matchingWorkspaceIds.length === 0) {
			return { status: RepositoryBindingResolutionStatus.UNRESOLVED };
		}

		if (matchingWorkspaceIds.length === 1) {
			return {
				status: RepositoryBindingResolutionStatus.RESOLVED,
				workspaceId: matchingWorkspaceIds[0] as number,
			};
		}

		const workspaces = accessibleWorkspaces
			.filter((workspace) => matchingWorkspaceIds.includes(workspace.id))
			.map((workspace) => ({ id: workspace.id, name: workspace.name }));

		return {
			status: RepositoryBindingResolutionStatus.AMBIGUOUS,
			workspaces,
		};
	}
}

export { RepositoryBindingService };
