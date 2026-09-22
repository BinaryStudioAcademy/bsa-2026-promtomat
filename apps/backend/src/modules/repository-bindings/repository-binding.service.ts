import {
	EMPTY_LENGTH,
	FIRST_ELEMENT_INDEX,
} from "~/libs/constants/constants.js";
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

const SINGLE_MATCH_COUNT = 1;

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

		if (payload.stackTags.length > EMPTY_LENGTH) {
			await this.workspaceService.appendStackTags(
				payload.workspaceId,
				payload.stackTags,
			);
		}

		return repositoryBinding.toObject();
	}

	public async delete(id: number): Promise<void> {
		const deletedRepositoryBindingCount =
			await this.repositoryBindingRepository.deleteById(id);

		if (!deletedRepositoryBindingCount) {
			throw RepositoryBindingError.notFound();
		}
	}

	public async findAllByWorkspaceId(
		workspaceId: number,
	): Promise<RepositoryBindingDto[]> {
		const repositoryBindings =
			await this.repositoryBindingRepository.findAllByWorkspaceId(workspaceId);

		return repositoryBindings.map((repositoryBinding) =>
			repositoryBinding.toObject(),
		);
	}

	public async findById(id: number): Promise<null | RepositoryBindingDto> {
		const repositoryBinding =
			await this.repositoryBindingRepository.findById(id);

		return repositoryBinding ? repositoryBinding.toObject() : null;
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

		if (matchingWorkspaceIds.length === EMPTY_LENGTH) {
			return { status: RepositoryBindingResolutionStatus.UNRESOLVED };
		}

		if (matchingWorkspaceIds.length === SINGLE_MATCH_COUNT) {
			return {
				status: RepositoryBindingResolutionStatus.RESOLVED,
				workspaceId: matchingWorkspaceIds[FIRST_ELEMENT_INDEX] as number,
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

	public async update(
		id: number,
		remoteUrl: string,
	): Promise<RepositoryBindingDto> {
		const identity = this.resolveIdentityOrThrow(remoteUrl);

		const repositoryBinding = await this.repositoryBindingRepository.update(
			id,
			identity,
		);

		return repositoryBinding.toObject();
	}
}

export { RepositoryBindingService };
